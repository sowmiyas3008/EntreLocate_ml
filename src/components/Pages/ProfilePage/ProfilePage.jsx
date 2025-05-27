

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, storage, auth } from "C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\firebaseConfig";
import { doc, getDoc, setDoc, getDocs, collection, query } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./ProfilePage.css";

const ProfilePage = () => {
  const [shopCategory, setShopCategory] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [totalProfit, setTotalProfit] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch and calculate fixed expenses
  const fetchFixedExpenses = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const fixedRef = doc(db, "users", user.email, "fixed", "details");
        const fixedSnap = await getDoc(fixedRef);
        
        if (fixedSnap.exists()) {
          const fixedData = fixedSnap.data();
          const expenses = fixedData.expenses || [];
          
          // Calculate total fixed expenses
          const totalFixed = expenses.reduce((total, expense) => {
            return total + (parseFloat(expense.amount) || 0);
          }, 0);
          
          setFixedExpenses(totalFixed);
          setNewExpenses(expenses.length > 0 ? expenses : [{ name: "", amount: "" }]);
        } else {
          setFixedExpenses(0);
          setNewExpenses([{ name: "", amount: "" }]);
        }
      } catch (error) {
        console.error("Error fetching fixed expenses:", error);
        setFixedExpenses(0);
      }
    }
  };

  // Fetch user data and monthly analytics
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
          }
          
          // Fetch fixed expenses separately
          await fetchFixedExpenses();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsLoading(false);
    };

    // Fetch and calculate profit/loss for current month
    const fetchCurrentMonthData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthName = currentDate.toLocaleString('default', { month: 'long' });
          setCurrentMonth(monthName);

          const userQuery = query(collection(db, `users/${user.email}/expenditure`));
          const querySnapshot = await getDocs(userQuery);

          const allData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            timestamp: new Date(doc.data().timestamp),
          }));

          // Filter data for the current month
          const currentMonthData = allData.filter((entry) => entry.timestamp >= firstDayOfMonth);

          // Calculate total profit/loss
          let totalProfitCalc = 0;
          const formattedData = currentMonthData.map((entry) => {
            totalProfitCalc += entry.profitOrLoss;
            return {
              date: entry.startDate,
              profit: entry.profitOrLoss,
              expenses: entry.expenses + fixedExpenses,
              outcome: entry.outcome,
            };
          });

          setMonthlyData(formattedData);
          setTotalProfit(totalProfitCalc);
        } catch (error) {
          console.error("Error fetching monthly data:", error);
        }
      }
    };

    if (!location.state) {
      fetchUserData();
    } else {
      const { shopCategory, ownerName, shopAddress } = location.state;
      setShopCategory(shopCategory);
      setOwnerName(ownerName);
      setShopAddress(shopAddress);
      fetchFixedExpenses();
      setIsLoading(false);
    }

    // Fetch current month data after fixed expenses are loaded
    setTimeout(fetchCurrentMonthData, 100);
  }, [location.state]);

  // Re-fetch current month data when fixed expenses change
  useEffect(() => {
    const fetchCurrentMonthData = async () => {
      const user = auth.currentUser;
      if (user && fixedExpenses >= 0) {
        try {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

          const userQuery = query(collection(db,`users/${user.email}/expenditure`));
          const querySnapshot = await getDocs(userQuery);

          const allData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            timestamp: new Date(doc.data().timestamp),
          }));

          const currentMonthData = allData.filter((entry) => entry.timestamp >= firstDayOfMonth);

          let totalProfitCalc = 0;
          const formattedData = currentMonthData.map((entry) => {
            totalProfitCalc += entry.profitOrLoss;
            return {
              date: entry.startDate,
              profit: entry.profitOrLoss,
              expenses: entry.expenses + fixedExpenses,
              outcome: entry.outcome,
            };
          });

          setMonthlyData(formattedData);
          setTotalProfit(totalProfitCalc);
        } catch (error) {
          console.error("Error fetching monthly data:", error);
        }
      }
    };

    fetchCurrentMonthData();
  }, [fixedExpenses]);

  // Handle saving fixed expenses
  const handleSaveExpenses = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Filter out empty expenses
    const validExpenses = newExpenses.filter(expense => 
      expense.name.trim() !== "" && expense.amount.trim() !== ""
    );

    const userRef = doc(db, "users", user.email, "fixed", "details");
    try {
      await setDoc(userRef, { expenses: validExpenses }, { merge: true });
      
      // Calculate and update total fixed expenses immediately
      const totalFixed = validExpenses.reduce((total, expense) => {
        return total + (parseFloat(expense.amount) || 0);
      }, 0);
      
      setFixedExpenses(totalFixed);
      alert("Expenses saved successfully!");
      setPopupVisible(false);
    } catch (error) {
      console.error("Error saving expenses:", error);
      alert("Error saving expenses. Please try again.");
    }
  };

  // Add new expense row
  const addNewExpenseRow = () => {
    setNewExpenses([...newExpenses, { name: "", amount: "" }]);
  };

  // Remove expense row
  const removeExpenseRow = (index) => {
    if (newExpenses.length > 1) {
      const updatedExpenses = newExpenses.filter((_, i) => i !== index);
      setNewExpenses(updatedExpenses);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          <div className="profile-name">{ownerName || "USER"}</div>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Boxes with updated values */}
        <div className="stat-cards">
          <div className="stat-card earnings">
            <div className="stat-title">Overall (Profit/Loss)</div>
            <div className="stat-value">$ {totalProfit.toFixed(2)}</div>
          </div>
          <div className="stat-card month">
            <div className="stat-title">Current Month</div>
            <div className="stat-value">{currentMonth}</div>
          </div>
          <div className="stat-card fixed">
            <div className="stat-title">Fixed Amount</div>
            <div className="stat-value">$ {fixedExpenses.toFixed(2)}</div>
          </div>
        </div>

        {/* Line Chart for Analytics */}
        <div className="chart-container">
          <h3>Results - {currentMonth}</h3>
          {monthlyData.length > 0 ? (
            <LineChart width={600} height={300} data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit/Loss" />
              <Line type="monotone" dataKey="expenses" stroke="#8884d8" name="Expenses" />
              <Line type="monotone" dataKey="outcome" stroke="#ff9500" name="Outcome" />
            </LineChart>
          ) : (
            <div className="chart-placeholder">No data available for {currentMonth}</div>
          )}
        </div>
      </div>

      {/* Fixed Expenses Popup */}
      {popupVisible && (
        <div className="fixed-popup-overlay">
          <div className="fixed-popup">
            <h2>Fixed Expenses</h2>

            <div className="fixed-list">
              {newExpenses.map((expense, index) => (
                <div key={index} className="add-expense">
                  <input
                    type="text"
                    placeholder="Expense Name"
                    value={expense.name}
                    onChange={(e) => {
                      const updatedExpenses = [...newExpenses];
                      updatedExpenses[index].name = e.target.value;
                      setNewExpenses(updatedExpenses);
                    }}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(e) => {
                      const updatedExpenses = [...newExpenses];
                      updatedExpenses[index].amount = e.target.value;
                      setNewExpenses(updatedExpenses);
                    }}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                  {newExpenses.length > 1 && (
                    <button 
                      onClick={() => removeExpenseRow(index)}
                      className="remove-btn"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="popup-buttons">
              <button onClick={addNewExpenseRow} className="calculate-btn">Add Row</button>
              <button onClick={handleSaveExpenses} className="calculate-btn">Save</button>
              <button onClick={() => setPopupVisible(false)} className="calculate-btn cancel">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;


// const ProfilePage = () => {
//   const [shopCategory, setShopCategory] = useState("");
//   const [ownerName, setOwnerName] = useState("");
//   const [shopAddress, setShopAddress] = useState("");
//   const [fixedExpenses, setFixedExpenses] = useState([]);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(true);

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

//   if (isLoading) {
//     return <div className="loading-container">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="profile-section">
//           {/* <img src={profileIcon} alt="Profile" className="profile-image" /> */}
//           <div className="profile-name">{ownerName || "Loading..."}</div>
//           <div className="profile-email">{auth.currentUser?.email || "Loading..."}</div>
//         </div>

//         <div className="navigation-menu">
          
//           <div className="menu-item active">
//             <i className="menu-icon analytics-icon"></i>
//             <span>Analytics</span>
//           </div>
//           <div className="menu-item" onClick={() => setPopupVisible(true)}>
//             <i className="menu-icon fixed-icon"></i>
//             <span>Fixed</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/expenditure")}>
//             <i className="menu-icon expenditure-icon"></i>
//             <span>Expenditure</span>
//           </div>
         
//           <div className="menu-item" onClick={() => navigate("/location")}>
//             <i className="menu-icon location-icon"></i>
//             <span>Location</span>
//           </div>
          
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Stat Cards */}
//         <div className="stat-cards">
//           <div className="stat-card earnings">
//             <div className="stat-title">Earning</div>
//             <div className="stat-value">$ {628}</div>
//           </div>
//           <div className="stat-card shares">
//             <div className="stat-title">Share</div>
//             <div className="stat-value">{2434}</div>
//           </div>
//           <div className="stat-card likes">
//             <div className="stat-title">Likes</div>
//             <div className="stat-value">{1259}</div>
//           </div>
//           <div className="stat-card rating">
//             <div className="stat-title">Rating</div>
//             <div className="stat-value">{8.5}</div>
//           </div>
//         </div>

//         {/* Shop Details */}
//         <div className="shop-details-card">
//           <h2>Shop Details</h2>
//           <div className="shop-detail-item">
//             <strong>Shop Category:</strong> {shopCategory}
//           </div>
//           <div className="shop-detail-item">
//             <strong>Owner Name:</strong> {ownerName}
//           </div>
//           <div className="shop-detail-item">
//             <strong>Shop Address:</strong> {shopAddress}
//           </div>
//         </div>

//         {/* Results Chart */}
//         <div className="chart-container">
//           <div className="chart-header">
//             <h3>Results</h3>
//             <span className="chart-period">This Month</span>
//           </div>
//           <div className="chart-placeholder">
//             {/* Chart would be placed here, using a placeholder for now */}
//             <div className="bar-chart-placeholder"></div>
//           </div>
//         </div>

//         {/* Additional Analytics */}
//         <div className="additional-analytics">
//           <div className="line-chart-container">
//             <div className="chart-placeholder">
//               {/* Line chart placeholder */}
//               <div className="line-chart-placeholder"></div>
//             </div>
//           </div>
//           <div className="percentage-chart">
//             <div className="donut-chart">
//               <div className="percentage">45%</div>
//             </div>
//             <div className="percentage-details">
//               <div className="percentage-item">Lorem ipsum</div>
//               <div className="percentage-item">Lorem ipsum</div>
//               <div className="percentage-item">Lorem ipsum</div>
//             </div>
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
//             <div className="popup-buttons">
//               <button className="add-btn" onClick={addNewExpenseRow}>Add</button>
//               <button className="save-btn" onClick={handleSaveExpenses}>Save</button>
//               <button className="close-btn" onClick={() => setPopupVisible(false)}>X</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

