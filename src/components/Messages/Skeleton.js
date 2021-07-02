import React from 'react'
import '../App.css'

const Skeleton = (props) => {

    return (
        <div className='skeleton'>
            <div className="skeleton__avatar" />
            <div className="skeleton__author" />
            <div className="skeleton__details" />
        </div>

    )
}

export default Skeleton
