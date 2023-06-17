export const getStudents = async (number = 20) => {
  let data;
  if(!localStorage.getItem('s')){
    const response = await fetch(`https://randomuser.me/api/?results=${number}`)
    data = await response.json();
    localStorage.setItem('s', JSON.stringify(data));
    return data;
  }else{
    data = localStorage.getItem('s');
    const dataParsed = JSON.parse(data!);
    return dataParsed;
  }
};

export const getSingleStudents = async (uuid=null) => {
  const data = localStorage.getItem('s');
  const dataParsed = JSON.parse(data!);
  console.log(dataParsed)
  // fetch(`https://randomuser.me/api/?uuid=${uuid}`)
  // .then(response => response.json())
  // .then(data => {
  //   return data
  // })
};

