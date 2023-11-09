import React from 'react'
import style from '../assets/styles/loading.module.scss'

const Loading = () => {
  return (
    <main className={style.main}>
        <div className={style.loading}>
            <div className={style.loadingDot}></div>
            <div className={style.loadingDot}></div>
            <div className={style.loadingDot}></div>
            <div className={style.loadingDot}></div>
            <div className={style.loadingDot}></div>
        </div>
    </main>
  )
}

export default Loading