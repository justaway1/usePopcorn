import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './App'
// import StarRating from './StarRating.js'
import TextExpander from './TextExpander.js'
// import { useState } from 'react'

// function Test () {
//   const [test, setTest] = useState(0)

//   return (
//     <div>
//       <StarRating maxRating={5} onSetRating={setTest} />
//       <p>This movie is rated {test}</p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <StarRating maxRating={10} />
    <StarRating maxRating={5} color={'red'} />
    <StarRating maxRating={8} defaultRating={1} color={'blue'} />
    <StarRating
      maxRating={5}
      color={'green'}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
    />
    <Test /> */}
    <TextExpander
      color={'red'}
      displayStyle={'inline-block'}
      truncateLength={20}
      className='box'
    >
      Text Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText
      Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot
      of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of
      TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of
      TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of
      TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXT
    </TextExpander>
    <TextExpander color={'orange'} displayStyle={'inline'} truncateLength={15}>
      Text Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText
      Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot
      of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of
      TEXTText Alot of TEXTText Alot of TEXT
    </TextExpander>
    <TextExpander
      text={'Display Me'}
      color={'blue'}
      displayStyle={'block'}
      showed={true}
    >
      Text Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText
      Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot
      of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of
      TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXTText Alot of TEXT
    </TextExpander>
  </React.StrictMode>
)
