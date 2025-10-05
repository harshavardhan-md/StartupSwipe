// 'use client';

// import { useState, useEffect } from 'react';
// import { STARTUPS } from '~/data/startups';
// import { Avatar, Identity, Name, Address } from '@coinbase/onchainkit/identity';
// import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
// import { useAccount } from 'wagmi';
// import { useStartupContract } from '~/hooks/useStartupContract';

// export default function Home() {
//   const { address, isConnected } = useAccount();
//   const { investInStartup, isPending, isConfirming, isSuccess } = useStartupContract();
//   const [coins, setCoins] = useState(10);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [investments, setInvestments] = useState<Record<number, number>>({});
//   const [screen, setScreen] = useState<'swipe' | 'leaderboard' | 'profile'>('swipe');
//   const [txHash, setTxHash] = useState<string>('');

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const saved = JSON.parse(localStorage.getItem('startupSwipeData') || '{}');
//       if (saved.coins !== undefined) setCoins(saved.coins);
//       if (saved.investments) setInvestments(saved.investments);
//       if (saved.currentIndex !== undefined) setCurrentIndex(saved.currentIndex);
//     }
//   }, []);

//   useEffect(() => {
//     if (isSuccess) {
//       const startup = STARTUPS[currentIndex - 1];
//       if (startup) {
//         alert(`✅ Investment recorded onchain for ${startup.name}!`);
//       }
//     }
//   }, [isSuccess, currentIndex]);

//   const saveData = (newCoins: number, newInvestments: Record<number, number>, newIndex: number) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('startupSwipeData', JSON.stringify({
//         coins: newCoins,
//         investments: newInvestments,
//         currentIndex: newIndex
//       }));
//     }
//   };

//   const invest = async () => {
//     if (coins <= 0) return;
    
//     const startup = STARTUPS[currentIndex];
    
//     const newInvestments = { ...investments, [startup.id]: (investments[startup.id] || 0) + 1 };
//     const newCoins = coins - 1;
//     const newIndex = currentIndex + 1;
    
//     setInvestments(newInvestments);
//     setCoins(newCoins);
//     setCurrentIndex(newIndex);
//     saveData(newCoins, newInvestments, newIndex);

//     if (isConnected && address) {
//       try {
//         const result = await investInStartup(startup.id);
//         if (result) {
//           setTxHash(result);
//         }
//       } catch (error) {
//         console.error('Transaction failed:', error);
//         alert('❌ Transaction failed. Your local investment is saved.');
//       }
//     } else {
//       alert('💡 Connect wallet to record investment onchain!');
//     }
//   };

//   const skip = () => {
//     const newIndex = currentIndex + 1;
//     setCurrentIndex(newIndex);
//     saveData(coins, investments, newIndex);
//   };

//   const getLeaderboard = () => {
//     return STARTUPS.map(s => ({
//       ...s,
//       totalCoins: investments[s.id] || 0
//     })).sort((a, b) => b.totalCoins - a.totalCoins);
//   };

//   // if (currentIndex >= STARTUPS.length) {
//   //   return (
//   //     <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-6 flex items-center justify-center">
//   //       <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">
//   //         <div className="text-6xl mb-4">🎉</div>
//   //         <h2 className="text-3xl font-bold mb-2">All Done!</h2>
//   //         <p className="text-gray-600 mb-6">You&apos;ve seen all startups for today</p>
//   //         <button 
//   //           onClick={() => setScreen('leaderboard')}
//   //           className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold"
//   //         >
//   //           View Leaderboard 🏆
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   if (currentIndex >= STARTUPS.length) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-6 flex items-center justify-center">
//         <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">
//           <div className="text-6xl mb-4">🎉</div>
//           <h2 className="text-3xl font-bold mb-2">All Done!</h2>
//           <p className="text-gray-600 mb-6">You&apos;ve seen all startups for today</p>
          
//           <div className="flex flex-col gap-3">
//             <button 
//               onClick={() => setScreen('leaderboard')}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold"
//             >
//               View Leaderboard 🏆
//             </button>
            
//             <button 
//               onClick={() => {
//                 // Reset everything
//                 setCurrentIndex(0);
//                 setCoins(10);
//                 setInvestments({});
//                 saveData(10, {}, 0);
//                 setScreen('swipe');
//               }}
//               className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold"
//             >
//               🔄 Start Over
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const startup = STARTUPS[currentIndex];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 pb-24">
//       <div className="p-5 flex justify-between items-center gap-3 flex-wrap">
//         <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full text-white font-bold">
//           💰 {coins} Coins {isPending && '⏳'} {isConfirming && '⛓️'}
//         </div>
//         <Wallet>
//           <ConnectWallet />
//           <WalletDropdown>
//             <Identity address={address} hasCopyAddressOnClick>
//               <Avatar />
//               <Name />
//               <Address />
//             </Identity>
//           </WalletDropdown>
//         </Wallet>
//       </div>

//       {!isConnected && (
//         <div className="mx-5 mb-4 bg-yellow-500/90 text-white px-4 py-3 rounded-2xl text-center font-medium text-sm">
//           ⚠️ Connect wallet to record investments onchain!
//         </div>
//       )}

//       {txHash && (
//         <div className="mx-5 mb-4 bg-green-500/90 text-white px-4 py-3 rounded-2xl text-center font-medium text-xs">
//           ✅ Last TX: <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">View on BaseScan</a>
//         </div>
//       )}

//       <div className="px-5 max-w-lg mx-auto">
//         {screen === 'swipe' && (
//           <>
//             <div className="bg-white rounded-3xl p-10 shadow-2xl mb-8 text-center">
//               <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl text-sm font-bold mb-5">
//                 {startup.category}
//               </div>
//               <h1 className="text-4xl font-bold mb-3 text-gray-900">{startup.name}</h1>
//               <p className="text-xl text-gray-600 mb-6">{startup.tagline}</p>
//               <div className="text-sm text-gray-500">
//                 Your Investments: {investments[startup.id] || 0} coins
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <button 
//                 onClick={skip}
//                 className="flex-1 bg-white/90 text-gray-700 py-5 rounded-2xl font-bold text-lg shadow-lg"
//                 disabled={isPending || isConfirming}
//               >
//                 ❌ Skip
//               </button>
//               <button 
//                 onClick={invest}
//                 disabled={coins <= 0 || isPending || isConfirming}
//                 className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50"
//               >
//                 {isPending ? '⏳ Signing...' : isConfirming ? '⛓️ Confirming...' : '💰 Invest'}
//               </button>
//             </div>
//           </>
//         )}

//         {screen === 'leaderboard' && (
//           <>
//             <h2 className="text-white text-3xl font-bold mb-8 text-center">🏆 Your Investments</h2>
//             {getLeaderboard().map((s, i) => (
//               <div key={s.id} className="bg-white/95 rounded-2xl p-4 mb-3 flex items-center gap-4">
//                 <span className="text-2xl font-bold text-purple-600 min-w-[50px]">#{i + 1}</span>
//                 <div className="flex-1">
//                   <div className="font-bold text-gray-900">{s.name}</div>
//                   <div className="text-sm text-gray-500">{s.category}</div>
//                 </div>
//                 <div className="font-bold text-pink-600">{s.totalCoins} 💰</div>
//               </div>
//             ))}
//           </>
//         )}

//         {screen === 'profile' && (
//           <>
//             <h2 className="text-white text-3xl font-bold mb-8 text-center">📊 Your Portfolio</h2>
            
//             {isConnected && (
//               <div className="bg-white/95 rounded-2xl p-4 mb-6 text-center">
//                 <div className="text-sm text-gray-500 mb-2">Connected Wallet</div>
//                 <div className="font-mono text-xs text-purple-600 break-all px-2">{address}</div>
//                 <div className="text-xs text-gray-400 mt-2">⛓️ Base Sepolia Testnet</div>
//               </div>
//             )}
            
//             <div className="flex gap-4 mb-8">
//               <div className="flex-1 bg-white/95 rounded-2xl p-6 text-center">
//                 <div className="text-4xl font-bold text-purple-600">{coins}</div>
//                 <div className="text-sm text-gray-500 mt-2">Coins Left</div>
//               </div>
//               <div className="flex-1 bg-white/95 rounded-2xl p-6 text-center">
//                 <div className="text-4xl font-bold text-purple-600">
//                   {Object.values(investments).reduce((a, b) => a + b, 0)}
//                 </div>
//                 <div className="text-sm text-gray-500 mt-2">Total Invested</div>
//               </div>
//             </div>
            
//             <h3 className="text-white text-xl font-bold mb-4">Your Investments</h3>
//             {Object.keys(investments).length === 0 ? (
//               <p className="text-white text-center">No investments yet. Start swiping!</p>
//             ) : (
//               Object.entries(investments).map(([id, amount]) => {
//                 const s = STARTUPS.find(st => st.id === parseInt(id));
//                 return s ? (
//                   <div key={id} className="bg-white/95 rounded-2xl p-4 mb-2 flex justify-between items-center">
//                     <div>
//                       <div className="font-medium">{s.name}</div>
//                       <div className="text-xs text-gray-500">Startup ID: {id}</div>
//                     </div>
//                     <span className="font-bold text-pink-600">{amount} 💰</span>
//                   </div>
//                 ) : null;
//               })
//             )}
//           </>
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg flex p-4 gap-3 border-t">
//         <button 
//           onClick={() => setScreen('swipe')}
//           className={`flex-1 py-3 rounded-xl font-bold transition-all ${screen === 'swipe' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
//         >
//           🎯 Swipe
//         </button>
//         <button 
//           onClick={() => setScreen('leaderboard')}
//           className={`flex-1 py-3 rounded-xl font-bold transition-all ${screen === 'leaderboard' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
//         >
//           🏆 Leaders
//         </button>
//         <button 
//           onClick={() => setScreen('profile')}
//           className={`flex-1 py-3 rounded-xl font-bold transition-all ${screen === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
//         >
//           👤 Profile
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Wallet as WalletIcon, Award, Zap, X, Check, BarChart3, Star } from 'lucide-react';
import { Avatar, Identity, Name, Address } from '@coinbase/onchainkit/identity';
import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { useStartupContract } from '~/hooks/useStartupContract';
import { STARTUPS } from '~/data/startups';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { investInStartup, isPending, isConfirming, isSuccess } = useStartupContract();
  const [coins, setCoins] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [investments, setInvestments] = useState<Record<number, number>>({});
  const [screen, setScreen] = useState<'swipe' | 'leaderboard' | 'profile'>('swipe');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('startupSwipeData') || '{}');
      if (saved.coins !== undefined) setCoins(saved.coins);
      if (saved.investments) setInvestments(saved.investments);
      if (saved.currentIndex !== undefined) setCurrentIndex(saved.currentIndex);
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const startup = STARTUPS[currentIndex - 1];
      if (startup) {
        showNotification(`Investment recorded onchain for ${startup.name}!`);
      }
    }
  }, [isSuccess, currentIndex]);

  const saveData = (newCoins: number, newInvestments: Record<number, number>, newIndex: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('startupSwipeData', JSON.stringify({
        coins: newCoins,
        investments: newInvestments,
        currentIndex: newIndex
      }));
    }
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const invest = async () => {
    if (coins <= 0) return;
    
    setSwipeDirection('right');
    setTimeout(() => setSwipeDirection(null), 400);
    
    const startup = STARTUPS[currentIndex];
    
    const newInvestments = { ...investments, [startup.id]: (investments[startup.id] || 0) + 1 };
    const newCoins = coins - 1;
    const newIndex = currentIndex + 1;
    
    setInvestments(newInvestments);
    setCoins(newCoins);
    setCurrentIndex(newIndex);
    saveData(newCoins, newInvestments, newIndex);

    if (isConnected && address) {
      try {
        const result = await investInStartup(startup.id);
        if (result) {
          setTxHash(result);
          showNotification(`Investment recorded onchain!`);
        }
      } catch (error) {
        console.error('Transaction failed:', error);
        showNotification('Transaction failed. Local investment saved.');
      }
    } else {
      showNotification(`Invested in ${startup.name}`);
    }
  };

  const skip = () => {
    setSwipeDirection('left');
    setTimeout(() => setSwipeDirection(null), 400);
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    saveData(coins, investments, newIndex);
    
    showNotification('Passed');
  };

  const getLeaderboard = () => {
    return STARTUPS.map(s => ({
      ...s,
      totalCoins: investments[s.id] || 0
    })).sort((a, b) => b.totalCoins - a.totalCoins);
  };

  const progress = ((currentIndex / STARTUPS.length) * 100).toFixed(0);

  if (currentIndex >= STARTUPS.length) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-foreground">
            All Done!
          </h2>
          <p className="text-muted-foreground text-lg">
            You&apos;ve reviewed all {STARTUPS.length} startups
          </p>
          
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => setScreen('leaderboard')}
              className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-2xl font-semibold transition-all hover:opacity-90"
            >
              View Results
            </button>
            
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setCoins(10);
                setInvestments({});
                saveData(10, {}, 0);
                setScreen('swipe');
              }}
              className="w-full border-2 border-border py-4 px-6 rounded-2xl font-semibold transition-all hover:bg-accent"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startup = STARTUPS[currentIndex];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-foreground text-background px-6 py-3 rounded-full shadow-lg font-medium text-sm">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">{coins}</span>
            {isPending && <span className="text-xs text-muted-foreground">Signing...</span>}
            {isConfirming && <span className="text-xs text-muted-foreground">Confirming...</span>}
          </div>
          
          <Wallet>
            <ConnectWallet />
            <WalletDropdown>
              <Identity address={address} hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Progress bar */}
        {screen === 'swipe' && (
          <div className="px-4 pb-3 max-w-2xl mx-auto">
            <div className="bg-accent rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-muted-foreground text-xs text-center mt-1.5">
              {currentIndex} of {STARTUPS.length}
            </p>
          </div>
        )}
      </div>

      {/* Connection Warning */}
      {!isConnected && screen === 'swipe' && (
        <div className="mx-4 mt-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-3 rounded-2xl text-center font-medium text-sm max-w-2xl">
          Connect wallet to record investments onchain
        </div>
      )}

      {/* Transaction Success */}
      {txHash && (
        <div className="mx-4 mt-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-2xl text-center font-medium text-xs max-w-2xl">
          TX: <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">View on BaseScan</a>
        </div>
      )}

      <div className="px-4 max-w-2xl mx-auto pt-6">
        {screen === 'swipe' && (
          <>
            {/* Startup Card */}
            <div 
              className={`mb-8 transition-all duration-400 ${
                swipeDirection === 'left' ? 'translate-x-[-120%] opacity-0' :
                swipeDirection === 'right' ? 'translate-x-[120%] opacity-0' :
                'translate-x-0 opacity-100'
              }`}
            >
              <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {startup.category}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium">
                      ID: {startup.id}
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                      {startup.name}
                    </h1>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {startup.tagline}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-accent rounded-2xl px-5 py-4">
                    <span className="text-sm font-medium text-muted-foreground">Your investment</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-foreground">
                        {investments[startup.id] || 0}
                      </span>
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={skip}
                disabled={isPending || isConfirming}
                className="flex-1 border-2 border-border bg-background py-5 rounded-2xl font-semibold text-lg transition-all hover:bg-accent active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
                Pass
              </button>
              
              <button 
                onClick={invest}
                disabled={coins <= 0 || isPending || isConfirming}
                className="flex-1 bg-primary text-primary-foreground py-5 rounded-2xl font-semibold text-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>⏳ Signing</>
                ) : isConfirming ? (
                  <>⛓️ Confirming</>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Invest
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {screen === 'leaderboard' && (
          <div className="pb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Leaderboard
              </h2>
              <p className="text-muted-foreground text-sm">Your top investments</p>
            </div>

            <div className="space-y-2">
              {getLeaderboard().map((s, i) => (
                <div 
                  key={s.id}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className={`text-2xl font-bold min-w-[40px] text-center ${
                    i === 0 ? 'text-yellow-500' :
                    i === 1 ? 'text-gray-400' :
                    i === 2 ? 'text-orange-500' :
                    'text-muted-foreground'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.category}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">{s.totalCoins}</div>
                    <div className="text-xs text-muted-foreground">coins</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'profile' && (
          <div className="pb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Portfolio
              </h2>
              <p className="text-muted-foreground text-sm">Your investment overview</p>
            </div>
            
            {isConnected && address && (
              <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <WalletIcon className="w-3 h-3" />
                  Connected Wallet
                </div>
                <div className="font-mono text-xs text-foreground break-all mb-2">{address}</div>
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
                  Base Sepolia Network
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">{coins}</div>
                <div className="text-xs text-muted-foreground">Coins Left</div>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">
                  {Object.values(investments).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Invested</div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Your Investments
            </h3>
            
            {Object.keys(investments).length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-muted-foreground mb-1">No investments yet</p>
                <p className="text-muted-foreground text-xs">Start swiping to build your portfolio</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(investments).map(([id, amount]) => {
                  const s = STARTUPS.find(st => st.id === parseInt(id));
                  return s ? (
                    <div key={id} className="bg-card border border-border rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-foreground">{s.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {id}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg text-foreground">{amount}</span>
                        <div className="text-xs text-muted-foreground">coins</div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex max-w-2xl mx-auto">
          <button 
            onClick={() => setScreen('swipe')}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${
              screen === 'swipe' 
                ? 'text-primary border-t-2 border-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Check className="w-5 h-5" />
              <span>Swipe</span>
            </div>
          </button>
          
          <button 
            onClick={() => setScreen('leaderboard')}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${
              screen === 'leaderboard' 
                ? 'text-primary border-t-2 border-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Award className="w-5 h-5" />
              <span>Leaders</span>
            </div>
          </button>
          
          <button 
            onClick={() => setScreen('profile')}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${
              screen === 'profile' 
                ? 'text-primary border-t-2 border-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <BarChart3 className="w-5 h-5" />
              <span>Portfolio</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}