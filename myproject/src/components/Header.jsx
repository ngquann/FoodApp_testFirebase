import { MdAdd, MdLogout, MdShoppingBasket } from "react-icons/md";

import Logo from '../img/logo.png';
import Avatar from '../img/avatar.png';

import { useState } from "react";
import { motion } from 'framer-motion';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase.config";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";


const Header = () => {

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [{ user, cartShow, cartItems }, dispatch] = useStateValue();

  const login = async () => {
    if (!user) {
      const { user: { refreshToken, providerData } } = await signInWithPopup(firebaseAuth, provider);

      dispatch({
        type: actionType.SET_USER,
        user: providerData[0],
      })

      localStorage.setItem("user", JSON.stringify(providerData[0]));
    } else {
      setIsMenu(!isMenu);
    }
  }

  const [isMenu, setIsMenu] = useState(false);

  const logout = () => {
    setIsMenu(false);

    localStorage.clear();
    dispatch({
      type: actionType.SET_USER,
      user: null,
    })
  };

  const showCart = () => {
    dispatch({
      type: actionType.SET_CART_SHOW,
      cartShow: !cartShow,
    })
  };

  return (
    <div className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">
      {/* desktop và tablet */}
      <div className="hidden md:flex w-full h-full items-center justify-between">
        <Link to={"/"} className='flex items-center gap-2'>
          <img src={Logo} alt="logo" className='w-8 object-cover' />
          <p className="text-headingColor text-xl font-bold">City</p>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-8">
            <li onClick={() => setIsMenu(false)} className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">Home</li>
            <li onClick={() => setIsMenu(false)} className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">Menu</li>
            <li onClick={() => setIsMenu(false)} className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">About</li>
            <li onClick={() => setIsMenu(false)} className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer">Service</li>
          </ul>

          <div className="relative flex justify-center items-center"
          onClick={showCart}>
            <MdShoppingBasket className='text-textColor text-2xl cursor-pointer' />
            {
              cartItems && cartItems.length > 0 && (
                <div className='absolute -top-2 -right-3 w-4 h-4 rounded-full bg-cartNumBg flex items-center justify-center'>
              <p className='text-xs text-white font-semibold'>{cartItems.length}</p>
            </div>
              )
            }
          </div>

          <div className="relative " onClick={login}>
            <motion.img whileTap={{ scale: 0.6 }} src={user ? user.photoURL : Avatar} alt="avatar" className="w-10 min-w-[40px] h-10 min-h-[40px] rounded-full" />

            {
              isMenu && (
                <motion.div
                  initial={{ opaciity: 0, scale: 0.6 }}
                  animate={{ opaciity: 1, scale: 1 }}
                  exit={{ opaciity: 0, scale: 0.6 }}
                  className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0">
                  {
                    user && user.email === "anhquannguyen1311@gmail.com" && (
                      <Link to={"/createItems"}>
                        <p onClick={() => setIsMenu(false)} className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base">New Items <MdAdd />
                        </p>
                      </Link>
                    )
                  }
                  <p onClick={logout} className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base">Logout <MdLogout /></p>
                </motion.div>
              )
            }
          </div>
        </div>
      </div>

      {/* mobile*/}
      <div className="flex md:hidden w-full h-full">
        <Link to={"/"} className='flex items-center gap-2'>
          <img src={Logo} alt="logo" className='w-8 object-cover' />
          <p className="text-headingColor text-xl font-bold">City</p>
        </Link>
      </div>
    </div>
  )
}

export default Header