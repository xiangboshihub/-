import { GoogleGenAI } from "@google/genai";
import { GroundingMetadata, ReportData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyReport = async (
  keywords: string[]
): Promise<ReportData> => {
  const model = "gemini-2.5-flash";
  
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Format date as YYYY-MM-DD for Google Search operators
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateStringZh = today.toLocaleDateString('zh-CN');
  const queryDate = formatDate(sevenDaysAgo); // e.g., 2023-10-27
  
  const keywordsString = keywords.join(" OR ");
  
  const prompt = `
    你是一个高级情报爬虫代理 (Intelligence Crawler Agent)。
    当前执行日期: ${dateStringZh}
    
    **【最高优先级指令】**: 
    用户要求所有信息必须是 **最近 7 天内 (${queryDate} 至今)** 发布的。
    严禁包含 ${queryDate} 之前的新闻。如果某个源在最近 7 天没有更新，请直接注明“本周无更新”。

    你的任务是利用 Google Search 的高级指令，模拟爬虫抓取以下源的最新数据：

    ---
    **任务目标清单 (Target List):**

    **Level 1: 每日高效扫读 (Newsletters)**
    *目标源 & 搜索指令:* 
    1. TLDR AI 
       - 搜索: site:tldr.tech/ai after:${queryDate}
    2. The Rundown AI 
       - 搜索: site:www.therundown.ai after:${queryDate}
    
    *采集要求:* 
    - 提取这两份 Newsletter 在**时间窗口内**发布的最新一期内容。
    - 总结 Top 3 关键 AI 进展。
    - **必须**在标题旁注明具体日期 (e.g., 10月28日)。

    **Level 2: 深度商业分析 (Blogs)**
    *目标源 & 搜索指令:* 
    1. Stratechery by Ben Thompson 
       - 搜索: site:stratechery.com after:${queryDate}
    
    *采集要求:* 
    - 寻找 Ben Thompson 最近 7 天发表的 "Daily Update" 或 "Article"。
    - 总结其核心商业洞察。
    - 若无官网更新，搜索他最近 7 天在 Twitter/X 上的热门观点 (搜索: Ben Thompson Stratechery twitter after:${queryDate})。

    **Level 3: 全网监控 (Alerts)**
    *监控关键词:* ${keywordsString}
    
    *采集要求:* 
    - 搜索指令: (${keywordsString}) after:${queryDate}
    - 寻找关于这些关键词的**突发新闻**或**重大版本发布**。
    - 过滤掉 SEO 营销号内容，只保留权威科技媒体报道。

    ---
    **输出格式规范 (Output Format):**
    1. **语言**: 简体中文。
    2. **标题**: ## 📅 7日情报概览 (${queryDate} ~ ${formatDate(today)})
    3. **结构**:
       ### 🚀 Level 1: Newsletter 重点
       ...
       ### 🧠 Level 2: 深度战略 (Stratechery)
       ...
       ### 🔍 Level 3: 关键词监控
       ...
    4. **引用**: 每一条信息必须附带 URL 来源。
    5. **自我审查**: 在输出每条信息前，检查其日期。如果是旧闻，直接丢弃。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Ensure the model knows we want fresh info
        systemInstruction: "You are a real-time intelligence gathering agent. You strictly ignore any information older than 7 days.",
      },
    });

    const text = response.text || "情报采集失败，未获取到有效数据。";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];

    return {
      content: text,
      sources: sources,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};