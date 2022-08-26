
function listify(list:any){
  return Array.isArray(list) ? list : [list];
}

export {
  listify
}