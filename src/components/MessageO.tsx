// import React, { useEffect, useState } from 'react';
// import { getStringFromMs, timeAgo } from '../utils/functions';
// import { iconsRef } from '../utils/iconsRef';
// import { FileEntry } from '../types';
// import { animated, useSpring } from '@react-spring/web';

// interface MessageProps {
//   id: string;
//   createdAt: string;
//   text?: string;
//   isOnLeft: boolean;
//   isLast: boolean;
//   fileEntry?: FileEntry;
//   downloadFile?: (filename: string, fileType: string) => void;
//   imageURL?: string;
//   type: string;
//   sender?: string;
//   receiver?: string;
//   isRecieved?: string;
//   isWatched?: string;
// }

// const MessageFabric: React.FC<MessageProps> = (props) => {
//   if (props.imageURL)
//     return <MediaMessage props={props} />;
//   if (props.fileEntry)
//     return  <FileMessage props={props}/>
//   if (props.type == 'timer') return <TimerMessage props={props}/>
//   return <TextMessage props={props} />;
// };


// // Subcomponent: MediaMessage
// const MediaMessage = ({props}:{props:MessageProps}) => {
//   const [springs, api] = useSpring(() => ({
//     opacity: 0,
//     config: { tension: 400, friction: 20 },
//   }));

//   useEffect(() => {
//     api.start({ opacity: 1 });

//   }, [api])

//   return (
//     <animated.div style={{ ...springs }}
//       className={`mt-1 mb-1 p-[8px] ${props.isOnLeft ? 'flex items-start' : 'flex items-end'} flex-col ${props.isLast && 'pb-10'
//         }`}
//     >
//       <section
//         className={`shadow-xl`}
//       >

//         <img
//           src={props.imageURL}
//           className="rounded-md"
//           style={{ width: '100%', objectFit: 'cover' }}
//         />
//       </section>
//       <section
//         className={`text-[14px] font-black text-bold pl-3 pr-3 ${props.isOnLeft ? '' : 'flex justify-end'
//           }`}
//       >
//         {timeAgo(props.createdAt)}
//       </section>
//     </animated.div>
//   );
// };

// // Subcomponent: TextMessage
// const TextMessage = ({props}:{props:MessageProps}) => {
//   const [springs, api] = useSpring(() => ({
//     opacity: 0,
//     config: { tension: 400, friction: 20 },
//   }));

//   useEffect(() => {
//     api.start({ opacity: 1 });

//   }, [api])

//   function getTick() {
//     if (true) return (
//       <Icon icon={iconsRef.tickDouble} w={35} h={30}/>
//     )
//     if (props.isWatched) return ( 
//       <Icon icon={iconsRef.tick} />
//     )

//   }

//   return (
//     <animated.div style={{ ...springs }}
//       className={`mt-1 mb-1 p-[8px] ${props.isOnLeft ? '' : 'flex items-end'} flex-col ${props.isLast && 'pb-10'
//         }`}
//     >
//       <section className='flex'>
//         {getTick()}
//         <div className={`p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] break-words text-[25px] shadow-xl ${props.isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
//           }`}>
//           {props.text}

//         </div>
//       </section>

//       <section
//         className={`text-[14px] font-black text-bold pl-3 pr-3 ${props.isOnLeft ? '' : 'flex justify-end'
//           }`}
//       >
//         {timeAgo(props.createdAt)}
//       </section>
//     </animated.div>
//   );
// };

// // Subcomponent: FileMessage (unchanged)
// const FileMessage = ({props}:{props:MessageProps}) => {
//   const [expired, setExpired] = useState(false);
//   const [timeLeft, setTimeLeft] = useState('');

//   const [springs, api] = useSpring(() => ({
//     opacity: 0,
//     config: { tension: 400, friction: 20 },
//   }));

//   useEffect(() => {
//     api.start({ opacity: 1 });

//   }, [api])

//   useEffect(() => {
//     console.log(props.isLast)
//     if (!props.fileEntry) return;

//     const timeRemaining = Math.max(0, props.fileEntry.acceptedAt + 5 * 60 * 1000 - Date.now());
//     if (timeRemaining === 0) {
//       setExpired(true);
//       setTimeLeft('');
//       return;
//     }

//     const updateCountdown = () => {
//       const now = Date.now();
//       // const timeRemaining = props.fileEntry.acceptedAt + 5 * 60 * 1000 - now;

//       if (timeRemaining <= 0) {
//         setExpired(true);
//         setTimeLeft('');
//         clearInterval(interval);
//       } else {
//         const minutesLeft = Math.floor(timeRemaining / 60000);
//         setTimeLeft(`${minutesLeft} m left`);
//       }
//     };

//     updateCountdown();
//     const interval = setInterval(updateCountdown, 1000 * 60); // Update every minute

//     return () => clearInterval(interval);
//   }, [props.fileEntry]);

//   if (props.fileEntry && props.downloadFile)
//     return (
//       <animated.div style={{ ...springs }}
//         className={`mt-1 mb-1 p-[8px] ${props.isOnLeft ? '' : 'flex items-end'} flex-col ${props.isLast && 'pb-10'
//           }`}
//       >
//         <section
//           className={`p-2 pl-2 pr-5 rounded-3xl inline-block min-w-[210px] max-w-[400px] shadow-xl relative hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
//             }`}
//           onClick={() => props.downloadFile(props.fileEntry.filename, props.fileEntry.fileType)}
//         >
//           <div className="flex flex-row">
//             <Icon icon={props.isOnLeft ? iconsRef.fileBlack : iconsRef.fileWhite} />
//             <div className="flex flex-col">
//               <a>{props.fileEntry.originalFilename.slice(0, -4)}</a>
//               <a
//                 className={`text-[15px] ${props.isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'
//                   }`}
//               >
//                 {props.fileEntry.size}
//               </a>
//             </div>
//           </div>
//           {!expired && timeLeft && (
//             <div className="flex flex-row align-center items-end justify-center absolute right-2 bottom-2">

//               <span
//                 className={`text-[14px] ${props.isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'
//                   }`}
//               >
//                 {timeLeft}
//               </span>
//               <img
//                 src={props.isOnLeft ? iconsRef.clocksBlack : iconsRef.clocksWhite}
//                 alt="Clock icon"
//                 width={25}
//                 height={25}
//                 className="ml-2"
//               />
//             </div>
//           )}

//         </section>
//         <section
//           className={`text-[14px] font-black text-bold pl-3 pr-3 ${props.isOnLeft ? '' : 'flex justify-end'
//             }`}
//         >
//           {timeAgo(props.createdAt)}
//         </section>
//       </animated.div>
//     );
//   else return <li></li>;
// };

// // Subcomponent: TextMessage
// const TimerMessage = ({props}:{props:MessageProps}) => {
//   const [springs, api] = useSpring(() => ({
//     opacity: 0,
//     config: { tension: 400, friction: 20 },
//   }));

//   useEffect(() => {
//     console.log(props.isLast)
//     api.start({ opacity: 1 });

//   }, [api])

//   return (
//     <animated.div style={{ ...springs }}
//       className={`mt-1 mb-1 p-[8px] flex flex-col items-center w-full ${props.isLast && 'pb-[100px]'}`}
//     >
//       <section
//         style={{ background: 'rgba(0, 0, 0, 0.1)' }}
//         className={` pl-5 pr-5 rounded-3xl break-words text-[30px] text-black`}
//       >
//         <a className='font-bold'>{props.sender} </a>
//         set self-destruct timer to
//         <a className='font-bold'> {getStringFromMs(props.text)}</a>

//       </section>

//     </animated.div>
//   );
// };

// // Helper Icon Component
// const Icon = ({ icon, w = 50, h = 50 }: { icon: string; w?: number; h?: number }) => {
//   return (
//     <img
//       src={icon}
//       width={w}
//       height={h}
//       style={{ cursor: 'pointer' }}
//     />
//   );
// };

const i = 2
export default i
