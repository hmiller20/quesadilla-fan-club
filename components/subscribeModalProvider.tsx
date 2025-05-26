'use client'
import React, { useState } from "react"
import Header from "@/components/header"

export default function SubscribeModalProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)

  // Clone children and pass setModalOpen as a prop
  const childrenWithProps = React.Children.map(children, child =>
    React.isValidElement(child) ? React.cloneElement(child, { setModalOpen }) : child
  )

  return (
    <>
      <Header modalOpen={modalOpen} setModalOpen={setModalOpen} />
      {childrenWithProps}
    </>
  )
}
