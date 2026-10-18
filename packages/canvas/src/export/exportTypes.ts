export interface ExportTokenSet { colors: string[] }
export interface ExportAssetRef { id: string }
export interface ExportComponentBinding { id: string }
export interface ExportWarning { code: string }
export interface ExportNode { id: string }
export interface ExportModel { exportModelVersion: string; rootNodeId: string; tokens: ExportTokenSet; layout: string; constraints: string[]; states: string[]; assets: ExportAssetRef[]; components: ExportComponentBinding[]; warnings: ExportWarning[] }
