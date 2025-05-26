'use client'
import React, { useState } from "react"
import Header from "@/components/header"

interface ChildProps {
  setModalOpen?: (open: boolean) => void;
}

export default function SubscribeModalProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)

  // Clone children and pass setModalOpen as a prop
  const childrenWithProps = React.Children.map(children, child =>
    React.isValidElement<ChildProps>(child) ? React.cloneElement(child, { setModalOpen }) : child
  )

  return (
    <>
      <Header onJoinClick={() => setModalOpen(true)} />
      {childrenWithProps}
    </>
  )
}
