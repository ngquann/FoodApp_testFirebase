import { motion } from "framer-motion";
import { useState } from "react"

import { MdAttachMoney, MdCloudUpload, MdDelete, MdFastfood, MdFoodBank } from "react-icons/md"
import { categories } from "../ultis/data";
import { Loader } from '../components';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase.config";
import { getAllFoodItems, saveItems } from "../ultis/firebaseFunctions";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const CreateContainer = () => {

  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [{foodItems}, dispatch] = useStateValue();

  const uploadimage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', (snapshot) => {
      const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
      (error) => {
        console.log(error);
        setFields(true)
        setMsg('Error while uploadding : Try Again')
        setAlertStatus('danger')
        setTimeout(() => {
          setFields(false)
          setIsLoading(false)
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImageAsset(downloadURL);
          setIsLoading(false);
          setFields(true);
          setMsg('Image Upload Successfully');
          setAlertStatus('Success');
          setTimeout(() => {
            setFields(false);
          }, 4000);
        }
        )
      });
  }

  const deleteImage = (e) => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setImageAsset(null)
      setIsLoading(false)
      setFields(true)
      setMsg('Image deleted Successfully');
      setAlertStatus('Success');
      setTimeout(() => {
        setFields(false);
      }, 4000);
    })
  };

  const saveDetails = () => {
    setIsLoading(true);
    try {
      if (!title || !calories || !imageAsset || !price || !category) {
        setFields(true)
        setMsg("Yêu cầu nhập đủ các trường thông tin")
        setAlertStatus('danger')
        setTimeout(() => {
          setFields(false)
          setIsLoading(false)
        }, 4000);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          imageURL: imageAsset,
          category: category,
          calories: calories,
          qty: 1,
          price: price
        }
        saveItems(data)
        setImageAsset(null)
        setIsLoading(false)
        setFields(true)
        setMsg('Data uploaded Successfully');
        clearData();
        setAlertStatus('Success');
        setTimeout(() => {
          setFields(false);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
      setFields(true)
      setMsg('Error while uploadding : Try Again')
      setAlertStatus('danger')
      setTimeout(() => {
        setFields(false)
        setIsLoading(false)
      }, 4000);
    }
    fetchData();
  };

  const clearData = () => {
    setTitle("");
    setImageAsset(null);
    setCalories("");
    setPrice(""); 
    setCategory("Select Category");
  };

  const fetchData = async () => {
    await getAllFoodItems().then(data => 
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data
      }))
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[90%] md:w-[75%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        {
          fields && (
            <motion.p initial={{ opaciity: 0 }}
              animate={{ opaciity: 1 }}
              exit={{ opaciity: 0 }}
              className={`w-full p-2 rounded-lg text-center text-base font-semibold ${alertStatus === 'danger' ? 'bg-red-400 text-red-800' : 'bg-emerald-400 text-emerald-800'}`}>
              {msg}
            </motion.p>
          )
        }
        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdFastfood className="text-xl text-gray-700" />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title....."
            className="w-full h-full text-xl bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
          />
        </div>

        <div className="w-full">
          <select className="outline-none w-full lg:w-[50%] text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer" onChange={(e) => setCategory(e.target.value)}>
            <option className="bg-white" value="other">Select Category</option>

            {
              categories && categories.map(category => (
                <option key={category.id} value={category.urlParamName} className="text-base border-0 outline-none capitalize bg-white text-textColor">
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>

        <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-420 cursor-pointer rounded-lg">
          {
            isLoading ? <Loader /> : <>
              {!imageAsset ? <>
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                    <p className="text-gray-500 hover:text-gray-700">Click here to upload</p>
                  </div>
                  <input className="w-0 h-0" type="file" name="uploadimage" accept="image/*" onChange={uploadimage} />
                </label>
              </> : (<>
                <div className="relative h-full">
                  <img
                    src={imageAsset} alt="uploadimage"
                    className="w-full h-full object-cover" />
                  <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out" onClick={deleteImage}><MdDelete className="text-white" /></button>
                </div>
              </>)}
            </>
          }
        </div>
        <div className="w-full flex flex-col md:flex-row items-center gap-3">
          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdFoodBank className="text-gray-700 text-2xl" />
            <input type="text"
              required
              value={calories}
              onChange={e => setCalories(e.target.value)}
              placeholder="Calories" className="w-full h-full text-lg bg-transparent outline-none placeholder:text-gray-400 text-textColor" />
          </div>
          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdAttachMoney className="text-gray-700 text-2xl" />
            <input type="text"
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price" className="w-full h-full text-lg bg-transparent outline-none placeholder:text-gray-400 text-textColor" />
          </div>
        </div>

        <div className="flex items-center w-full">
          <button type="button" className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py02 rounded-lg text-lg text-white font-semibold" onClick={saveDetails}>SAVE</button>
        </div>
      </div>
    </div>
  )

}

export default CreateContainer