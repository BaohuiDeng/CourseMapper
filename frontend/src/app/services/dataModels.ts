export class EditData {
    constructor(
        public _id: string,
        public name: string
    ){ }
    
}

export class newSubCategory {

    constructor(
        public parentCategory: string,
        public name: string

    ){ }

   
    
}

export class hideModel {
    constructor(
        public indexStatus: boolean,
        public index: number
    ){}

}


export class NodeModel {
    constructor(
    public subCategories: NodeModel[],
    public courseTags: any [],
    public id:string,
    public dateAdded:string,
    public dateUpdated:string,
    public slug:string,
    public name :string,
    public positionFromRoot: {
    x: number,
    y: number
    },
    public __v:number
    )
    {   }


}