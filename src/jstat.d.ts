declare module "jstat" {
  interface JStatNormal {
    cdf(x: number, mean: number, std: number): number;
    pdf(x: number, mean: number, std: number): number;
    inv(p: number, mean: number, std: number): number;
  }
  interface JStatStatic {
    normal: JStatNormal;
  }
  const jStat: JStatStatic;
  export = jStat;
}
