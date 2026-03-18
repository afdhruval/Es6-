import React, { useState, useRef, useEffect } from 'react'
import { Howl, Howler } from 'howler';
import VanillaTilt from 'vanilla-tilt';

const sound = new Howl({
  src: ["/up.mp3"]
});
Howler.volume(0.5);

const App = () => {

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [data, setData] = useState([])

  const [editIndex, setEditIndex] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = () => {
    if (!isPlaying) {
      sound.play();
      setIsPlaying(true);
    }
  };

  const stopSound = () => {
    sound.stop();
    setIsPlaying(false);
  };

  const tiltRef = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tiltRef.current, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }, []);

  // ✅ CREATE + UPDATE
  const handleForm = (e) => {
    e.preventDefault();

    if (!name || !email) return;

    const newData = { name, email };

    if (editIndex !== null) {
      const updatedData = [...data];
      updatedData[editIndex] = newData;
      setData(updatedData);
      setEditIndex(null);
    } else {
      setData([...data, newData]);
    }

    setname("");
    setemail("");
  };

  // ✅ DELETE
  const handleDelete = (index) => {
    const filtered = data.filter((_, i) => i !== index);
    setData(filtered);
  };

  // ✅ EDIT
  const handleEdit = (index) => {
    const item = data[index];
    setname(item.name);
    setemail(item.email);
    setEditIndex(index);
  };

  // ✅ CANCEL EDIT
  const handleCancel = () => {
    setname("");
    setemail("");
    setEditIndex(null);
  };

  return (
    <div
      className='h-screen w-full flex items-center justify-center flex-col gap-5'
      style={{ background: "linear-gradient(to top ,crimson,lightblue,white)" }}
    >
      {/* TOP BUTTONS */}
      <div className='w-[80%] h-[60px] flex justify-end items-center gap-8'>
        <button onClick={playSound} className='bg-gray-800 text-white/90 h-[50px] w-[140px] rounded'>
          Play Sound
        </button>
        <button onClick={stopSound} className='bg-gray-800 text-white/90 h-[50px] w-[140px] rounded'>
          Stop Sound
        </button>
      </div>

      <h1 className='font-bold text-6xl h-[80px] w-full flex items-center justify-center'>
        CRUD IN TABLE
      </h1>

      {/* MAIN CARD */}
      <div ref={tiltRef} className='w-[860px] min-h-[500px] bg-[#b19999] rounded-2xl flex flex-col items-center justify-start gap-6'>

        <br /><br />

        {/* FORM */}
        <form
          onSubmit={handleForm}
          className='w-full h-[200px] flex flex-col items-center justify-center gap-6'
        >
          <div className='flex items-center justify-center gap-4 w-full h-[50px]'>
            <label className='text-2xl w-[100px]'>Name :</label>
            <input
              type="text"
              className='border-2 outline-none border-white rounded-md w-[300px] h-[40px]'
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
          </div>

          <div className='flex items-center justify-center gap-4 w-full h-[50px]'>
            <label className='text-2xl w-[100px]'>Email :</label>
            <input
              type="text"
              className='border-2 outline-none border-white rounded-md w-[300px] h-[40px]'
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
          </div>

          {/* ✅ BUTTONS */}
          <div className='flex gap-4'>
            <button className='h-[40px] w-[100px] bg-gray-300/50 rounded-2xl'>
              {editIndex !== null ? "Update" : "Submit"}
            </button>

            {editIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className='h-[40px] w-[100px] bg-red-300 rounded-2xl'
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* TABLE */}
        <div className='w-full min-h-[200px] flex items-start justify-center overflow-y-auto'>
          <table className='w-[90%] border h-auto'>
            <thead>
              <tr className='bg-gray-200 h-[40px]'>
                <th className='border w-[30%]'>Name</th>
                <th className='border w-[30%]'>Email</th>
                <th className='border w-[40%]'>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="3" className='text-center h-[50px]'>
                    No data
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className='text-center h-[50px]'>
                    <td className='border'>{item.name}</td>
                    <td className='border'>{item.email}</td>
                    <td className='border flex gap-2 justify-center'>
                      <button
                        onClick={() => handleEdit(index)}
                        className='bg-blue-400 px-2 rounded'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className='bg-red-400 px-2 rounded'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  )
}

export default App