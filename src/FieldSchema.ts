export interface IFolderTypeFieldInfo {
    name: string;
    label: string;
    hint: string;
    type: string;
    group: string;
    rules: string[][];
}
export interface IFieldOverride {
    [name:string]: {
        label?:string;
        hint?:string;
        hide?:boolean;
    }
}