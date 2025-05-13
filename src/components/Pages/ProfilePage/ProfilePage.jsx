// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { db, storage, auth } from "C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\firebaseConfig";
// import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./ProfilePage.css";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, storage, auth } from "C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\firebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import "./ProfilePage.css";
// import profileIcon from "D:\\react\\busi_project\\src\\assets\\account.webp"; 

// const ProfilePage = () => {
//   const [shopCategory, setShopCategory] = useState("");
//   const [ownerName, setOwnerName] = useState("");
//   const [shopAddress, setShopAddress] = useState("");
//   const [uploadedPhoto, setUploadedPhoto] = useState(null);
//   const [photoFile, setPhotoFile] = useState(false); // For the photo upload
//   const [isEditing, setIsEditing] = useState(false);
//   const [fixedExpenses, setFixedExpenses] = useState([]);
//   const [popupVisible, setPopupVisible] = useState(false); // Popup visibility
//   const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(true);

//   // Handle photo upload
//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPhotoFile(file);
//       const photoRef = ref(storage, `users/${auth.currentUser.email}/photo.jpg`);
//       await uploadBytes(photoRef, file);
//       const photoURL = await getDownloadURL(photoRef);
//       setUploadedPhoto(photoURL);
//       alert("Photo uploaded successfully!");
//     }
//   };

//   // Fetch data on component load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.email);
//           const docSnap = await getDoc(userRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setShopCategory(data.shopCategory || "");
//             setOwnerName(data.ownerName || "");
//             setShopAddress(data.shopAddress || "");
//             setFixedExpenses(data.fixedExpenses || []);
//             const photoRef = ref(storage, `users/${user.email}/photo.jpg`);
//             try {
//               const photoURL = await getDownloadURL(photoRef);
//               setUploadedPhoto(photoURL);
//             } catch {
//               console.log("No photo found.");
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//       setIsLoading(false);
//     };

//     if (!location.state) {
//       fetchUserData();
//     } else {
//       const { shopCategory, ownerName, shopAddress, fixedExpenses } = location.state;
//       setShopCategory(shopCategory);
//       setOwnerName(ownerName);
//       setShopAddress(shopAddress);
//       setFixedExpenses(fixedExpenses || []);
//       setIsLoading(false);
//     }
//   }, [location.state]);

//   // Handle popup save
//   const handleSaveExpenses = async () => {
//     const userRef = doc(db, "users", auth.currentUser.email, "fixed", "details");
//     try {
//       await setDoc(userRef, { expenses: newExpenses }, { merge: true });
//       alert("Expenses saved successfully!");
//       setPopupVisible(false);
//     } catch (error) {
//       console.error("Error saving expenses:", error);
//     }
//   };

//   // Add new row
//   const addNewExpenseRow = () => {
//     setNewExpenses([...newExpenses, { name: "", amount: "" }]);
//   };

//   // Handle expenditure button click
//   const handleExpenditureClick = () => {
//     navigate("/expenditure");
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container">
//       {/* Left Section */}
//       <div className="left-section">
//         <div className="photo-upload">
//           {uploadedPhoto ? (
//             <img src={uploadedPhoto} alt="Uploaded" className="uploaded-photo" />
//           ) : (
//             <div className="photo-placeholder">No Photo</div>
//           )}
//           <label className="upload-label">
//             Upload Photo
//             <input
//               type="file"
//               className="upload-input"
//               onChange={handlePhotoUpload}
//               accept="image/*"
//             />
//           </label>
//         </div>

//         <div className="button-group">
//           <button
//             className="action-btn"
//             onClick={() => setPopupVisible(true)} // Show popup
//           >
//             FIXED
//           </button>
//           {/*<button className="action-btn" onClick={handleExpenditureClick}>
//             EXPENDITURE
//           </button> */}
//           <button
//   className="action-btn"
//   onClick={() => navigate("/expenditure")} // Match the route in App.jsx
// >
//   EXPENDITURE
// </button>

//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="right-section">
//         <div className="profile-card">
//           <h2>Owner and Shop Details</h2>
//           <div>
//             <strong>Shop Category:</strong> {shopCategory}
//           </div>
//           <div>
//             <strong>Owner Name:</strong> {ownerName}
//           </div>
//           <div>
//             <strong>Shop Address:</strong> {shopAddress}
//           </div>
//         </div>
//       </div>

//       {/* Fixed Expenses Popup */}
//       {popupVisible && (
//         <div className="fixed-popup-overlay">
//           <div className="fixed-popup">
//             <h2>Fixed Expenses</h2>
//             {newExpenses.map((expense, index) => (
//               <div key={index} className="add-expense">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={expense.name}
//                   onChange={(e) =>
//                     setNewExpenses(
//                       newExpenses.map((exp, i) =>
//                         i === index ? { ...exp, name: e.target.value } : exp
//                       )
//                     )
//                   }
//                 />
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={expense.amount}
//                   onChange={(e) =>
//                     setNewExpenses(
//                       newExpenses.map((exp, i) =>
//                         i === index ? { ...exp, amount: e.target.value } : exp
//                       )
//                     )
//                   }
//                 />
//               </div>
//             ))}
//             <button onClick={addNewExpenseRow}>Add</button>
//             <button onClick={handleSaveExpenses}>Save</button>
//             <button className="close-btn" onClick={() => setPopupVisible(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;



const ProfilePage = () => {
  const [shopCategory, setShopCategory] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.email);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setShopCategory(data.shopCategory || "");
            setOwnerName(data.ownerName || "");
            setShopAddress(data.shopAddress || "");
            setFixedExpenses(data.fixedExpenses || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsLoading(false);
    };

    if (!location.state) {
      fetchUserData();
    } else {
      const { shopCategory, ownerName, shopAddress, fixedExpenses } = location.state;
      setShopCategory(shopCategory);
      setOwnerName(ownerName);
      setShopAddress(shopAddress);
      setFixedExpenses(fixedExpenses || []);
      setIsLoading(false);
    }
  }, [location.state]);

  // Handle popup save
  const handleSaveExpenses = async () => {
    const userRef = doc(db, "users", auth.currentUser.email, "fixed", "details");
    try {
      await setDoc(userRef, { expenses: newExpenses }, { merge: true });
      alert("Expenses saved successfully!");
      setPopupVisible(false);
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  };

  // Add new row
  const addNewExpenseRow = () => {
    setNewExpenses([...newExpenses, { name: "", amount: "" }]);
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          {/* <img src={profileIcon} alt="Profile" className="profile-image" /> */}
          <div className="profile-name">{ownerName || "Loading..."}</div>
          <div className="profile-email">{auth.currentUser?.email || "Loading..."}</div>
        </div>

        <div className="navigation-menu">
          
          <div className="menu-item active">
            <i className="menu-icon analytics-icon"></i>
            <span>Analytics</span>
          </div>
          <div className="menu-item" onClick={() => setPopupVisible(true)}>
            <i className="menu-icon fixed-icon"></i>
            <span>Fixed</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/expenditure")}>
            <i className="menu-icon expenditure-icon"></i>
            <span>Expenditure</span>
          </div>
         
          <div className="menu-item" onClick={() => navigate("/location")}>
            <i className="menu-icon location-icon"></i>
            <span>Location</span>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stat Cards */}
        <div className="stat-cards">
          <div className="stat-card earnings">
            <div className="stat-title">Earning</div>
            <div className="stat-value">$ {628}</div>
          </div>
          <div className="stat-card shares">
            <div className="stat-title">Share</div>
            <div className="stat-value">{2434}</div>
          </div>
          <div className="stat-card likes">
            <div className="stat-title">Likes</div>
            <div className="stat-value">{1259}</div>
          </div>
          <div className="stat-card rating">
            <div className="stat-title">Rating</div>
            <div className="stat-value">{8.5}</div>
          </div>
        </div>

        {/* Shop Details */}
        <div className="shop-details-card">
          <h2>Shop Details</h2>
          <div className="shop-detail-item">
            <strong>Shop Category:</strong> {shopCategory}
          </div>
          <div className="shop-detail-item">
            <strong>Owner Name:</strong> {ownerName}
          </div>
          <div className="shop-detail-item">
            <strong>Shop Address:</strong> {shopAddress}
          </div>
        </div>

        {/* Results Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Results</h3>
            <span className="chart-period">This Month</span>
          </div>
          <div className="chart-placeholder">
            {/* Chart would be placed here, using a placeholder for now */}
            <div className="bar-chart-placeholder"></div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="additional-analytics">
          <div className="line-chart-container">
            <div className="chart-placeholder">
              {/* Line chart placeholder */}
              <div className="line-chart-placeholder"></div>
            </div>
          </div>
          <div className="percentage-chart">
            <div className="donut-chart">
              <div className="percentage">45%</div>
            </div>
            <div className="percentage-details">
              <div className="percentage-item">Lorem ipsum</div>
              <div className="percentage-item">Lorem ipsum</div>
              <div className="percentage-item">Lorem ipsum</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Expenses Popup */}
      {popupVisible && (
        <div className="fixed-popup-overlay">
          <div className="fixed-popup">
            <h2>Fixed Expenses</h2>
            {newExpenses.map((expense, index) => (
              <div key={index} className="add-expense">
                <input
                  type="text"
                  placeholder="Name"
                  value={expense.name}
                  onChange={(e) =>
                    setNewExpenses(
                      newExpenses.map((exp, i) =>
                        i === index ? { ...exp, name: e.target.value } : exp
                      )
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={expense.amount}
                  onChange={(e) =>
                    setNewExpenses(
                      newExpenses.map((exp, i) =>
                        i === index ? { ...exp, amount: e.target.value } : exp
                      )
                    )
                  }
                />
              </div>
            ))}
            <div className="popup-buttons">
              <button className="add-btn" onClick={addNewExpenseRow}>Add</button>
              <button className="save-btn" onClick={handleSaveExpenses}>Save</button>
              <button className="close-btn" onClick={() => setPopupVisible(false)}>X</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

