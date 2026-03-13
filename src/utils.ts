export const tsToTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString('zh-CN', { hour12: false });

export const shortAddr = (addr: string) =>
  addr.length > 16 ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : addr;
