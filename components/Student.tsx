import { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom"
import {getSingleStudents} from '../src/api'


const Student = () => {

  const {id} =  useParams();
  const [student, setStudent] = useState<{} | any>({name:{first:"test", last:"name"}})
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleStudents();
  }, [id]);

  // const fetchStudent = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://randomuser.me/api/?uuid=${id}`);
  //     const data = await response.json();
  //     const results = data.results[0];
  //     //console.log(results)
  //     setStudent(results);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching students:', error);
  //   }
  // };

  return (
    <div className="user">
      {loading ? 'Loading...':<div>{student ? student.name.first+' '+student.name.last : ''}</div>
      }
    </div>
  )
}

export default Student
