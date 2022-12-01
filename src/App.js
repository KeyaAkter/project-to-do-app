import { createContext, useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TaskList from "./components/TaskList";

// creating context
export const DeleteHandlerContext = createContext();

// edit context
export const EditHandlerContext = createContext();

const App = () => {
  // For post task to the server
  const [tasks, setTasks] = useState([]);

  // For loading data
  const [loading, setLoading] = useState(true);

  // For error data
  const [error, setError] = useState("");

  // For editing data
  const [editedText, setEditedText] = useState("");

  // For toggling data
  const [toggleEditMode, setToggleEditMode] = useState(true);

  useEffect(() => {
    // Getting Data From Server
    fetchingData();
  }, []);

  // Fetching Data
  const fetchingData = async () => {
    try {
      const res = await fetch(
        "https://hallowed-ambitious-mouth.glitch.me/tasks"
      );
      if (!res.ok) throw new Error("Something Went Wrong!");
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete Event
  const deleteHandler = (id) => {
    // delete data using id
    deleteData(id);

    // set updated task
    setTasks(tasks.filter((task) => id !== task.id));
  };

  // Delete Data Function

  const deleteData = async (id) => {
    await fetch(`https://hallowed-ambitious-mouth.glitch.me/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  };

  // Editing Event

  const editHandler = (id) => {
    const [editableTarget] = tasks.filter((task) => id === task.id);
    editableTarget.isEditable = true; // property add to the obj
    setEditedText(editableTarget.text);

    setTasks([...tasks]);
    setToggleEditMode(false);

    // Re-arrange
    tasks
      .filter((task) => task.id !== id)
      .map((target) => (target.isEditable = false));
  };

  // Editing task form handler

  const editHandleSubmitter = (e, id) => {
    e.preventDefault();

    setToggleEditMode(!toggleEditMode);

    // Persist data
    const editPersistance = {
      text: editedText,
      id: id,
    };

    // PUT REQUEST

    puttingRequest(id, editPersistance);

    // Real Time Update

    const [editableTarget] = tasks.filter((task) => id === task.id);
    editableTarget.isEditable = false; // property add to the obj
    editableTarget.text = editPersistance.text;

    setTasks([...tasks]);
  };

  const puttingRequest = async (id, newData) => {
    fetch(`https://hallowed-ambitious-mouth.glitch.me/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newData),
    });
  };

  return (
    <div className="wrapper bg-gradient-to-t from-gray-900 to-teal-900 min-h-screen text-xl text-gray-100 flex flex-col py-10">
      <DeleteHandlerContext.Provider value={deleteHandler}>
        <EditHandlerContext.Provider value={editHandler}>
          <Header />
          <AddTask tasks={tasks} setTasks={setTasks} />
          <TaskList
            tasks={tasks}
            error={error}
            loading={loading}
            editHandleSubmitter={editHandleSubmitter}
            editedText={editedText}
            setEditedText={setEditedText}
          />
          <Footer />
        </EditHandlerContext.Provider>
      </DeleteHandlerContext.Provider>
    </div>
  );
};

export default App;
