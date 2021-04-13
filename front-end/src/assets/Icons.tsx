import React from "react"

interface StyleProps{
  style?: React.CSSProperties
}

export const tamagoLogo = <svg enable-background="new 0 0 40 40" version="1.1" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">

	<path d="M20,38.5c-7.187,0-9.938-3.458-11.583-5.524c-0.317-0.399-0.592-0.745-0.854-1.007   C6.55,30.957,1.5,25.623,1.5,20c0-3.496,3.29-5.978,5.934-7.973c1.277-0.963,2.381-1.795,3.044-2.648   c0.573-0.737,0.887-1.637,1.218-2.589C12.601,4.189,13.536,1.5,20,1.5c2.146,0,4.043,0.58,6.052,1.193   c0.74,0.226,1.497,0.457,2.289,0.668c0.586,0.155,1.199,0.292,1.818,0.43c2.124,0.472,4.319,0.96,5.498,2.307   C38.5,9.349,38.5,15.505,38.5,20c0,5.708-2.141,8.151-4.851,11.243l-0.3,0.343c-0.589,0.674-1.084,1.311-1.562,1.927   C29.456,36.516,27.916,38.5,20,38.5z" fill="#fff"/>
	<path d="M20,2c2.071,0,3.933,0.569,5.905,1.171c0.739,0.226,1.503,0.459,2.307,0.673   c0.599,0.159,1.229,0.299,1.838,0.435c2.045,0.455,4.159,0.925,5.23,2.148C38,9.536,38,15.584,38,20   c0,5.519-1.982,7.781-4.725,10.911l-0.302,0.345c-0.599,0.685-1.098,1.328-1.581,1.95C29.151,36.093,27.671,38,20,38   c-6.946,0-9.604-3.34-11.192-5.336c-0.327-0.411-0.61-0.766-0.892-1.049C6.928,30.627,2,25.424,2,20   c0-3.247,3.047-5.545,5.735-7.573c1.306-0.985,2.433-1.836,3.137-2.741c0.623-0.801,0.965-1.783,1.295-2.732   C13.054,4.406,13.892,2,20,2 M20,1c-9.195,0-7.896,5.473-9.917,8.072C8.062,11.67,1,14.587,1,20c0,5.567,4.679,10.793,6.209,12.322   C8.739,33.852,11.175,39,20,39c9.789,0,10.243-3.101,13.726-7.085C36.646,28.574,39,26.107,39,20c0-4.788-0.044-10.89-2.967-14.231   c-1.643-1.878-4.897-2.182-7.564-2.891C25.483,2.083,23.014,1,20,1L20,1z"/>


	<circle cx="23" cy="19" r="7.5" fill="#FCEA2B"/>
	<path d="m23 12c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7m0-1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" fill="#BA9B48"/>
    <text x="18.15625" y="22.59375" fill="#000000" fill-opacity="null" font-family="sans-serif" font-size="10" opacity="undefined" stroke="#000" stroke-dasharray="null" stroke-opacity="null" stroke-width="0">卵</text>

</svg>;


export const editButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"  height="25" width="25" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
</svg>

export const deleteButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>

export const likeButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
</svg>

export const likedButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" height="25" width="25" fill="red">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
</svg>

export const shareButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
</svg>

export const sharedButtonIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" height="25" width="25" fill="currentColor">
    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
</svg>

export const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export const loginIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
</svg>;

export const profileIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg>;

export const defaultProfilePic = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="130" width="130" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg>;

export const settingsIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>;

export const inboxIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
</svg>;

export const makePostIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
</svg>;

export const logoutIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
</svg>;

export const homeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
</svg>;

export const mailIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>;

export const peopleIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>;

export const githubIcon = <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
</svg>;

export const clearInboxIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
</svg>;

export const chevronDoubleDown = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
</svg>;

export const linkIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" height="25" width="25">
    <path strokeLinecap="round" style={{height:'100%'}} strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
</svg>

export const followingIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
</svg>;

export const followersIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
</svg>;

export const unfollowIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
</svg>;

export const followIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
</svg>;

export const backIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke="grey" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
</svg>;

export const plainTextIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
</svg>

export const markdownIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
</svg>;

export const pngIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" height="25" width="25" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>;

export const jpegIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" height="25" width="25">
<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
</svg>;

export function UserProfileIcon(props:StyleProps){
  return(
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={props.style}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
  )
};

export function tamagoEgg(height: string, width: string) { return (<svg viewBox="0 0 72 72" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
<g>
    <path d="m56.237 30.064c-0.2373-0.5156-3.7627-8.6885-6.4961-13.068-3.7412-5.9951-7.5937-8.9951-13.741-8.9951s-10 3-13.74 8.9951c-2.7344 4.3809-6.2598 12.553-6.4971 13.068-1.7617 3.2529-2.7627 6.9775-2.7627 10.936 0 12.702 10.297 23 23 23s23-10.298 23-23c0-3.959-1.001-7.6836-2.7627-10.936z" fill="#fff"/>
    <path d="m56.237 30.064c-0.2373-0.5156-6.2627-12.65-6.4961-13.068-2.0742-3.1621-3.4912-4.9956-6.6474-7.2021 1.7861 6.0273 3.9199 13.249 4.0605 13.748 1.7578 5.4795 2.7617 11.728 2.7617 18.358 0 7.0791-1.1367 13.705-3.1142 19.407 7.2568-3.8681 12.198-11.51 12.198-20.307 0-3.959-1.001-7.6836-2.7627-10.936z" fill="#d0cfce"/>
    <path d="m56.237 30.064c-0.2373-0.5156-3.7627-8.6885-6.4961-13.068-3.7412-5.9951-7.5937-8.9951-13.741-8.9951s-10 3-13.74 8.9951c-2.7344 4.3809-6.2598 12.553-6.4971 13.068-1.7617 3.2529-2.7627 6.9775-2.7627 10.936 0 12.702 10.297 23 23 23s23-10.298 23-23c0-3.959-1.001-7.6836-2.7627-10.936z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <text x="24.00001" y="45.41405" fill="#000000" font-family="sans-serif" font-size="24" opacity="undefined" stroke="#000" stroke-width="0">卵</text>
  </g>
</svg>)
};

export function getNum(num: number) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black" viewBox="0 0 24 24" height="20" width="20" stroke="black">
      <text x="5" y="19">{num}</text>
    </svg>);
};