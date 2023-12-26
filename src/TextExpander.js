import { useState } from 'react'

const textStyle = {
  marginTop: '10px'
}
export default function TextExpander ({
  children,
  color,
  text = 'Show More',
  displayStyle,
  truncateLength = 10,
  showed = false,
  className
}) {
  const [isText, setIsText] = useState(showed)

  const showMoreStyle = {
    color,
    display: displayStyle,
    cursor: 'pointer'
  }

  return (
    <div style={textStyle} className={className}>
      {!isText
        ? children.split(' ').slice(0, truncateLength).join(' ') + ' ... '
        : children}
      <span style={showMoreStyle} onClick={() => setIsText(!isText)}>
        {isText ? 'Show Less' : text}
      </span>
    </div>
  )
}
