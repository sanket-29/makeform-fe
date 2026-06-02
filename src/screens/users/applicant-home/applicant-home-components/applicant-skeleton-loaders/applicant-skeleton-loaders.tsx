// import React, { ForwardedRef, forwardRef } from 'react'
// import { Stack, Skeleton, Card } from '@components'
// import { ApplicantSkeletonLoadersData } from '../../applicant-home.type'
// import { useMediaQuery } from '@mui/material'

// const ApplicantSkeletonLoaders = forwardRef((
//     {
//         type = 'my summary cards'
//     }: ApplicantSkeletonLoadersData,
//     ref: ForwardedRef<HTMLDivElement>
// ) => {
//     //added By priya 02-12-2024
//     //-----------------------
//     const isSmallMobile = useMediaQuery('(min-width:320px) and (max-width:380px)')
//     {/* //----------------------- */ }
//     {/* //end priya 02-12-2024 */ }
//     return (
//         //added By priya 02-12-2024
//         //-----------------------

//         <>
//         {/* //added by priya 04-12-2024 */}
//         {/* //------------------------- */}
//             {type === "my apps" && (
//                 <>
//                     <Skeleton sx={{ width: '423px', height: '30px', borderRadius: '16px', mb: '24px' }} />
//                     {/* <Skeleton sx={{width:'659px',height:'20px',borderRadius:'16px',mb:6}}/>
//     <Skeleton sx={{width:'144px',height:'20px',borderRadius:'16px'}}/> */}

//                 </>
//             )}
//             {type === "my apps title" && (
//                 <Skeleton sx={{ width: '144px', height: '20px', borderRadius: '16px', mb: 2 }} />

//             )}
//             {
//                 type === 'my summary cards' &&
//                 // <>
//                 //     <Skeleton variant='text' sx={{
//                 //         mr: 2, alignItems: 'center',
//                 //     }} />
//                 //     <Skeleton variant='text' sx={{
//                 //         mr: 2, alignItems: 'center',
//                 //     }} />
//                 //     <Skeleton variant='text' sx={{
//                 //         mr: 2, alignItems: 'center', mb: 2.2
//                 //     }} />
//                 // </>
//                 <>
//                 <Stack sx={{width: { lg: '159px', xs: '149px', sm: '172px', md: '172px' }, height: '160px', top: '333px', left: '610px', borderRadius: '12px',      '@media (max-width: 375px)': {
//         width: '130px',
//       },}}>
//                     <Skeleton sx={{ width: '78px', height: '20px', borderRadius: '16px' }} />
//                     <Skeleton sx={{ width: '109px', height: '10px', borderRadius: '16px' }} />
//                     <Skeleton sx={{ width: '109px', height: '10px', borderRadius: '16px' }} />
//                     <Skeleton sx={{ width: '109px', height: '10px', borderRadius: '16px' }} />
//                     <Skeleton sx={{ width: '48px', height: '10px', borderRadius: '16px' }} />
//                     </Stack>
//                 </>
//             }
//                 {/* //----------------------- */ }
//     {/* //end priya 04-12-2024 */ }
//             {/* //added By priya 03-12-2024 */}
//             {/* //----------------------- */}

//             {
//                 type === 'my application cards' &&
//                 <>
//                     <Card sx={{
//                         borderRadius: '16px', width: '346px', height: '339px', '@media (min-width:320px) and (max-width:380px)': {
//                             width: '290px'
//                         }
//                     }} >
//                         <Stack direction={'row'} rowGap={1} padding={2}>
//                             <Skeleton sx={{
//                                 width: '32px', height: '20px', padding:
//                                     1,
//                                 ml: '-24px',
//                                 borderRadius: '0px 20px 20px 0px', alignItems: 'center', mt: 2
//                             }} />
//                             <Stack direction={'column'} sx={{ ml: 2, gap: '4px' }}>


//                                 <Skeleton variant="text"
//                                     sx={{
//                                         fontWeight: !isSmallMobile ? 700 : 600, whiteSpace: !isSmallMobile ? 'nowrap' : 'wrap', lineHeight: '27.16px', fontSize: !isSmallMobile ? '20px' : '14px', mt: 2, width: '170px', height: '40px',
//                                         '@media (min-width:320px) and (max-width:425px)': {
//                                             width: '140px',
//                                         },
//                                     }}
//                                 />
//                                 <Skeleton variant="text" sx={{ width: '170px', height: '30px' }} />
//                             </Stack>
//                             <Skeleton variant="text" sx={{
//                                 borderRadius: '20px', ml: !isSmallMobile ? '32px' : '-8px',
//                                 mr: !isSmallMobile ? 0 : '8px', padding: '0 !important', mt: '21px', width: '48px', height: '17px'
//                             }} />
//                         </Stack>
//                         <Stack direction="column" spacing={2} flexWrap="wrap" sx={{ ml: 7 }}>
//                             <Stack direction="row" spacing={1.5} alignItems="center" >
//                                 <Skeleton variant="rectangular" sx={{ width: '20px', height: '24px' }} />
//                                 <Skeleton variant="text" sx={{ width: '120px', height: '24px' }} />
//                             </Stack>
//                             <Stack direction="row" spacing={1.5} alignItems="center" >
//                                 <Skeleton variant="rectangular" sx={{ width: '20px', height: '24px' }} />
//                                 <Skeleton variant="text" sx={{ width: '120px', height: '24px' }} />
//                             </Stack>
//                             <Stack direction="row" spacing={1.5} alignItems="center" >
//                                 <Skeleton variant="rectangular" sx={{ width: '20px', height: '24px' }} />
//                                 <Skeleton variant="text" sx={{ width: '120px', height: '24px' }} />
//                             </Stack>
//                             <Stack direction="row" spacing={1.5} alignItems="center" >
//                                 <Skeleton variant="rectangular" sx={{ width: '20px', height: '24px' }} />
//                                 <Skeleton variant="text" sx={{ width: '120px', height: '24px' }} />
//                             </Stack>
//                             <Stack direction="row" spacing={1.5} alignItems="center" >
//                                 <Skeleton variant="rectangular" sx={{ width: '20px', height: '24px' }} />
//                                 <Skeleton variant="text" sx={{ width: '120px', height: '24px' }} />
//                             </Stack>


//                         </Stack>
//                     </Card>
//                 </>
//             }
//             {
//                 type === 'search in myapps' &&
//                 <>
//                     <Skeleton variant='rectangular' sx={{
//                         width: { lg: '266px', xs: '180px', md: '266px', sm: '266px' }, height: '40px', borderRadius: '7px', border: '1px solid #9E9E9E', ml: { xs: 0, sm: 2, md: 2, lg: 2 }, justifyContent: 'flex-start', alignItems: 'flex-start', color: '#BDBDBD', mb: 2, mt: 1,
//                         '@media (min-width:375px) and (max-width:426px)': {
//                             width: '210px'
//                         },
//                     }}
//                     />
//                     <Stack direction={'column'} sx={{ ml: 2, gap: '8px' }}>

//                     </Stack>


//                 </>
//             }
//             {
//                 type === 'sortBy in myapps' &&
//                 <>
//                     <Stack
//                         sx={{
//                             justifyContent: 'flex-end',
//                             alignItems: 'flex-end',
//                             alignSelf: 'flex-end',
//                             flexGrow: 1,
//                             mt: { xs: '-50px' },
//                             width: '133px',
//                             height: '53px',
//                             mr: 2,

//                             '@media (min-width:1487px) and (max-width:2000px)': {
//                                 mr: 8
//                             },
//                         }}>
//                         <Skeleton variant='rectangular' sx={{
//                             alignSelf: 'flex-end', mb: 3, width: '133px',
//                             height: '53px',
//                             '@media (min-width:320px) and (max-width:425px)': {
//                                 width: '95px',
//                                 mr: '-24px'
//                             },
//                         }} />

//                     </Stack>
//                 </>
//             }
//             {type === 'applicant text' &&
//                 <>
//                     <Stack
//                         direction="row"
//                         sx={{
//                             gap: 0.5,

//                         }}
//                     > <Skeleton variant="rounded" sx={{
//                         fontSize: '12px', fontWeight: 300, letterSpacing: '-0.5%', color: '#E5E7EB', lineHeight: '32px', width: '725px', mb: 6



//                     }} />

//                     </Stack>
//                 </>}
//             {/* //----------------------- */}
//             {/* //end priya 03-12-2024 */}
//         </>
//         //-----------------------
//         //end priya 02-12-2024
//     )
// })
// ApplicantSkeletonLoaders.displayName = 'ApplicantSkeletonLoaders'
// export default ApplicantSkeletonLoaders