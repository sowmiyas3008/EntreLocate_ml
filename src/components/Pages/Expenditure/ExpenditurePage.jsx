// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { db } from 'C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\firebaseConfig';
// import { doc, setDoc, getDocs,getDoc, collection, query, where } from 'firebase/firestore';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { db, auth } from 'C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\firebaseConfig';
import { doc, setDoc, getDocs, getDoc, collection, query } from 'firebase/firestore';
import './ExpenditurePage.css'; // Reusing the same CSS

// const ExpenditurePage = () => {
//   const [startMonth, setStartMonth] = useState('');
//   const [endMonth, setEndMonth] = useState('');
//   const [expenses, setExpenses] = useState('');
//   const [outcome, setOutcome] = useState('');
//   const [fixedExpenses, setFixedExpenses] = useState(0);
//   const [profitOrLoss, setProfitOrLoss] = useState(null);
//   const [result, setResult] = useState('');
//   const [chartData, setChartData] = useState([]);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);
//   const [showResults, setShowResults] = useState(false);
//   const [ownerName, setOwnerName] = useState("");
  
//   const navigate = useNavigate();

//   // Fetch user data and owner name
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.email);
//           const docSnap = await getDoc(userRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setOwnerName(data.ownerName || "");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Fetch fixed expenses from the database
//   const fetchFixedExpenses = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       try {
//         const fixedRef = doc(db, `users/${user.email}/fixed/details`);
//         const fixedDoc = await getDoc(fixedRef);
//         if (fixedDoc.exists()) {
//           const fixedData = fixedDoc.data().expenses || [];
//           const totalFixed = fixedData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
//           setFixedExpenses(totalFixed);
//         }
//       } catch (error) {
//         console.error('Error fetching fixed expenses:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchFixedExpenses();
//   }, []);

//   // Fetch existing data for the user
//   useEffect(() => {
//     const fetchUserExpenditureData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         try {
//           const userQuery = query(
//             collection(db, `users/${user.email}/expenditure`)
//           );
//           const querySnapshot = await getDocs(userQuery);
//           const data = querySnapshot.docs.map((doc) => ({
//             name: `Record ${doc.id}`,
//             ...doc.data(),
//           }));
//           const formattedData = data.map((entry) => ({
//             name: `${entry.startMonth}-${entry.endMonth}`,
//             value: entry.profitOrLoss,
//             expenses: entry.expenses + entry.fixedExpenses,
//             outcome: entry.outcome
//           }));
//           setChartData(formattedData);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       }
//     };

//     fetchUserExpenditureData();
//   }, []);

//   // Handle calculation and storing data
//   const calculateAndStore = async () => {
//     const expenseValue = parseFloat(expenses) || 0;
//     const outcomeValue = parseFloat(outcome) || 0;
    
//     const totalExpenses = fixedExpenses + expenseValue;
//     const profitOrLossValue = outcomeValue - totalExpenses;
//     const resultValue = profitOrLossValue >= 0 ? "Profit" : "Loss";
    
//     const data = {
//       startMonth,
//       endMonth,
//       expenses: expenseValue,
//       fixedExpenses,
//       outcome: outcomeValue,
//       profitOrLoss: profitOrLossValue,
//       result: resultValue,
//       timestamp: new Date().toISOString(),
//     };
    
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const docRef = doc(db, `users/${user.email}/expenditure`, new Date().getTime().toString());
//         await setDoc(docRef, data);
//         alert("Data saved successfully!");
//       } else {
//         alert("No user is signed in. Please sign in to save data.");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
    
//     setProfitOrLoss(profitOrLossValue);
//     setResult(resultValue);
    
//     setChartData((prevData) => [
//       ...prevData,
//       { 
//         name: `${startMonth}-${endMonth}`, 
//         value: profitOrLossValue,
//         expenses: totalExpenses,
//         outcome: outcomeValue 
//       }
//     ]);

//     setShowResults(true);
//   };

//   // Handle popup save
//   const handleSaveExpenses = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       const userRef = doc(db, `users/${user.email}/fixed`, "details");
//       try {
//         await setDoc(userRef, { expenses: newExpenses }, { merge: true });
//         alert("Expenses saved successfully!");
//         setPopupVisible(false);
//         fetchFixedExpenses(); // Refresh fixed expenses
//       } catch (error) {
//         console.error("Error saving expenses:", error);
//       }
//     }
//   };

//   // Add new row
//   const addNewExpenseRow = () => {
//     setNewExpenses([...newExpenses, { name: "", amount: "" }]);
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="profile-section">
//           <div className="profile-name">{ownerName || "Loading..."}</div>
//           <div className="profile-email">{auth.currentUser?.email || "Loading..."}</div>
//         </div>

//         <div className="navigation-menu">
//           <div className="menu-item" onClick={() => navigate("/ProfilePage")}>
//             <i className="menu-icon analytics-icon"></i>
//             <span>Analytics</span>
//           </div>
//           <div className="menu-item" onClick={() => setPopupVisible(true)}>
//             <i className="menu-icon fixed-icon"></i>
//             <span>Fixed</span>
//           </div>
//           <div className="menu-item active">
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
//         <div className={`expenditure-content ${showResults ? 'with-results' : ''}`}>
//           {/* Expenditure Form */}
//           <div className={`expenditure-form ${showResults ? 'shifted' : ''}`}>
//             <div className="shop-details-card">
//               <h2>Expenditure Tracker</h2>
//               <div className="form-group">
//                 <label>Start Month and Year:</label>
//                 <input
//                   type="month"
//                   value={startMonth}
//                   onChange={(e) => setStartMonth(e.target.value)}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>End Month and Year:</label>
//                 <input
//                   type="month"
//                   value={endMonth}
//                   onChange={(e) => setEndMonth(e.target.value)}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Variable Expenses (₹):</label>
//                 <input
//                   type="number"
//                   value={expenses}
//                   onChange={(e) => setExpenses(e.target.value)}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Outcome Gained (₹):</label>
//                 <input
//                   type="number"
//                   value={outcome}
//                   onChange={(e) => setOutcome(e.target.value)}
//                   required
//                   className="form-input"
//                 />
//               </div>
//               <button className="calculate-btn" onClick={calculateAndStore}>
//                 Calculate and Save
//               </button>
//             </div>
//           </div>

//           {/* Results Section */}
//           {showResults && (
//             <div className="results-section">
//               <div className="shop-details-card">
//                 <h2>Result: {result}</h2>
//                 <p><strong>Fixed Expenses:</strong> ₹{fixedExpenses}</p>
//                 <p><strong>Profit or Loss Amount:</strong> ₹{profitOrLoss}</p>
                
//                 <div className="chart-container">
//                   <div className="chart-header">
//                     <h3>Visual Representation</h3>
//                     <span className="chart-period">All Records</span>
//                   </div>
//                   <BarChart width={550} height={300} data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="value" fill="#82ca9d" name="Profit/Loss" />
//                     <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
//                     <Bar dataKey="outcome" fill="#ff9500" name="Outcome" />
//                   </BarChart>
//                 </div>
//               </div>
//             </div>
//           )}
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

// export default ExpenditurePage;

const ExpenditurePage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expenses, setExpenses] = useState('');
  const [outcome, setOutcome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(null);
  const [result, setResult] = useState('');
  const [chartData, setChartData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [newExpenses, setNewExpenses] = useState([{ name: "", amount: "" }]);
  const [showResults, setShowResults] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  
  const navigate = useNavigate();

  // Function to fetch and calculate fixed expenses (same as ProfilePage)
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

  // Fetch user data and owner name
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.email);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOwnerName(data.ownerName || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
    fetchFixedExpenses();
    fetchUserExpenditureData();
  }, []);

  // Fetch existing data for the user
  const fetchUserExpenditureData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userQuery = query(collection(db, `users/${user.email}/expenditure`));
        // const fixedRef = doc(db, `users/${user.email}/fixed/details`);
        const querySnapshot = await getDocs(userQuery);
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp),
        }));
        
        // Get last two days of analytics
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const filteredData = data.filter((entry) => entry.timestamp >= twoDaysAgo);

        setChartData(filteredData.map((entry) => ({
          name: entry.startDate,
          value: entry.profitOrLoss,
          expenses: entry.expenses + entry.fixedExpenses,
          outcome: entry.outcome,
        })));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Handle calculation and storing data
  const calculateAndStore = async () => {
    const expenseValue = parseFloat(expenses) || 0;
    const outcomeValue = parseFloat(outcome) || 0;
    
    const totalExpenses = fixedExpenses + expenseValue;
    const profitOrLossValue = outcomeValue - totalExpenses;
    const resultValue = profitOrLossValue >= 0 ? "Profit" : "Loss";
    
    const data = {
      startDate,
      endDate,
      expenses: expenseValue,
      fixedExpenses,
      outcome: outcomeValue,
      profitOrLoss: profitOrLossValue,
      result: resultValue,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, `users/${user.email}/expenditure`, new Date().getTime().toString());
        
        await setDoc(docRef, data);
        alert("Data saved successfully!");
      } else {
        alert("No user is signed in. Please sign in to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
    
    setProfitOrLoss(profitOrLossValue);
    setResult(resultValue);
    setShowResults(true);
    fetchUserExpenditureData();
  };

  // Handle saving fixed expenses (same as ProfilePage)
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
          <div className="menu-item" onClick={() => navigate("/ProfilePage")}>
            <i className="menu-icon analytics-icon"></i>
            <span>Analytics</span>
          </div>
          <div className="menu-item" onClick={() => setPopupVisible(true)}>
            <i className="menu-icon fixed-icon"></i>
            <span>Fixed</span>
          </div>
          <div className="menu-item active">
            <i className="menu-icon expenditure-icon"></i>
            <span>Expenditure</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className={`expenditure-content ${showResults ? 'with-results' : ''}`}>
          {/* Expenditure Form */}
          <div className={`expenditure-form ${showResults ? 'shifted' : ''}`}>
            <div className="shop-details-card">
              <h2>Expenditure Tracker</h2>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Variable Expenses (₹):</label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Outcome Gained (₹):</label>
                <input
                  type="number"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Fixed Expenses (₹):</label>
                <div className="fixed-expenses-display">
                  <span className="fixed-amount">₹{fixedExpenses.toFixed(2)}</span>
                    <span></span>
                     <button 
                    type="button"
                    className="edit-fixed-btn"
                    onClick={() => setPopupVisible(true)}
                  >
                        Edit Fixed Expenses
                  </button>
                </div>
              </div>
              <button className="calculate-btn" onClick={calculateAndStore}>
                Calculate and Save
              </button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="results-section">
              <div className="shop-details-card">
                <h2>Result: {result}</h2>
                <p><strong>Fixed Expenses:</strong> ₹{fixedExpenses.toFixed(2)}</p>
                <p><strong>Profit or Loss Amount:</strong> ₹{profitOrLoss.toFixed(2)}</p>
                
                <div className="chart-container">
                  <div className="chart-header">
                    <h3>Previous Days Analytics</h3>
                  </div>
                  <BarChart width={550} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Profit/Loss" />
                    <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
                    <Bar dataKey="outcome" fill="#ff9500" name="Outcome" />
                  </BarChart>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Expenses Popup - Same as ProfilePage */}
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

export default ExpenditurePage;