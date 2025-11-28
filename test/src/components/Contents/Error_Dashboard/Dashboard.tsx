'use client'

import { motion } from 'motion/react'
const ErrorMessage = "Oops! Page not found, but feel free to take this opportunity to play some games, chill or just relax "

import Carousel from '@/components/Contents/Error_Dashboard/Carousel'


export default function Dashboard() {
  return (
    <div className="w-screen h-screen p-6">
      <div className="grid grid-cols-4 grid-rows-12 gap-4 h-full">
        {/* Main Content Area - 3x11 */}
        <div className="col-span-3 row-span-11 rounded-[32px] bg-white shadow-lg overflow-hidden relative">
          <Carousel />
        </div>

        {/* Top Right - 1x4 */}
        <div className="col-span-1 row-span-2 rounded-3xl bg-white shadow-lg p-6">
          {/* Stats Widget */}
          <div className="flex justify-center items-center h-full">{ ErrorMessage }</div>
        </div>

        {/* Middle Right - 1x4 */}
        <div className="rounded-3xl row-span-4 bg-white shadow-lg">
          {/* Quick Actions */}
        </div>

        {/* Middle Right 2 - 1x3 */}
        <div className="rounded-3xl row-span-5 bg-white shadow-lg">
          {/* Settings */}
        </div>

        {/* Bottom Left - 3x1 */}
        <div className="col-span-3 rounded-3xl bg-white shadow-lg">
          {/* Recent Games */}
          
        </div>

        {/* Bottom Right - 1x1 */}
        <div className="col-span-1 rounded-3xl bg-white shadow-lg">
          {/* Game Categories */}
        </div>
      </div>
    </div>
  )
}