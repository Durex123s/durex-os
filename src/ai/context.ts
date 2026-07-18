export interface PerignonContext {

  finances?: {
    revenus:number;
    depenses:number;
    solde:number;
  };


  planning?: {
    taches:number;
    evenements:number;
  };


  objectifs?: {
    total:number;
    termines:number;
  };


  discipline?: {
    score:number;
    habitudes:number;
  };

}


export const defaultContext:PerignonContext = {

 finances:{
  revenus:0,
  depenses:0,
  solde:0
 },


 planning:{
  taches:0,
  evenements:0
 },


 objectifs:{
  total:0,
  termines:0
 },


 discipline:{
  score:0,
  habitudes:0
 }

};
