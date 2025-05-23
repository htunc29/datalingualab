"use client"
import React from 'react'
import {RiSurveyLine} from 'react-icons/ri'
import { FaCheck, FaClock, FaUser, FaUsers } from 'react-icons/fa6'
import Image from 'next/image'
import {useSession} from 'next-auth/react'
import { BarChart } from '@mui/x-charts/BarChart'
import StatisticCard from '../components/StatisticCard';
import { HashLoader } from 'react-spinners'
export default function Dashboard() {
  const exampleData = [
    { name: '1', value: 100 },
    { name: '2', value: 130 },
    { name: '3', value: 120 },
    { name: '4', value: 150 },
  ];
    const { data: session, status } = useSession();
  if(status === "loading") return <div className='h-screen flex justify-center items-center'><HashLoader/></div>
  return (
    <section className='p-4 md:p-5'>
      <h1 className='my-4 text-2xl font-bold'>Hoşgeldin, {session.user.name}</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
        <div className='bg-white shadow-sm rounded-sm  gap-2 p-4 '>
          <h3>Toplam Anket</h3>
          <div className='my-4 flex flex-row gap-4 items-center'>
            <RiSurveyLine className='bg-rose-500 rounded-full p-2 text-white'  size={60}/>
            <span className='text-3xl font-bold'>15</span>
          </div>
          
        </div>
        <div className='bg-white shadow-sm rounded-sm  gap-2 p-4 '>
          <h3>Toplam Katılımcı Sayısı</h3>
          <div className='my-4 flex flex-row gap-4 items-center'>
            <FaUser className='bg-blue-500 rounded-full p-2 text-white'  size={60}/>
            <span className='text-3xl font-bold'>150</span>
          </div>
          
        </div>
        <div className='bg-white shadow-sm rounded-sm  gap-2 p-4 '>
          <h3>Biten Anketler</h3>
          <div className='my-4 flex flex-row gap-4 items-center'>
            <FaCheck className='bg-green-500 rounded-full p-2 text-white'  size={60}/>
            <span className='text-3xl font-bold'>5</span>
          </div>
          
        </div>
        <div className='bg-white shadow-sm rounded-sm  gap-2 p-4 '>
          <h3>Devam Eden Anket</h3>
          <div className='my-4 flex flex-row gap-4 items-center'>
            <FaClock className='bg-amber-500 rounded-full p-2 text-white'  size={60}/>
            <span className='text-3xl font-bold'>15</span>
          </div>
          
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-2'>
      <div className='p-4 md:p-6 bg-white rounded-sm shadow-sm'>
      <BarChart
      tooltip={{trigger:'axis'}}
      colors={["#FF0B55", "#FFDEDE"]}
      xAxis={[
        {
          scaleType: 'band',
          data: ['Oyun ve Gençler..', 'Üniversitelerde ..', 'Deneme....'],
        },
      ]}
      series={[
        {
          data: [15, 25, 35],
          label: "Katılımcı Sayısı",
        },
      ]}
      className='w-full h-auto'
      height={300}
    />
      </div>
      <div className='p-4 md:p-6 bg-white rounded-sm shadow-sm'>
      <StatisticCard 
  title="Katılımcı Sayısı" 
  value="150" 
  percentChange={12} 
  data={exampleData} 
  timeframe="Haftalık"
/>
      </div>
      <div className='p-4 md:p-6 bg-white rounded-sm shadow-sm'>
        <h3 className='font-bold'>Popüler Anketler</h3>
          <div className='flex flex-col gap-2 mt-4'>
            <div className='flex justify-between shadow-inner bg-slate-200 p-2 rounded-sm'>
                <h4>Oyunların gençler üzerindeki etkileri</h4>
                <div className='flex gap-2 items-center'>
                  <FaUsers/> 120
                </div>
            </div>
            <div className='flex justify-between shadow-inner bg-slate-200 p-2 rounded-sm'>
                <h4>Üniversiteler</h4>
                <div className='flex gap-2 items-center'>
                  <FaUsers/> 100
                </div>
            </div>
            <div className='flex justify-between shadow-inner bg-slate-200 p-2 rounded-sm'>
                <h4>Deneme</h4>
                <div className='flex gap-2 items-center'>
                  <FaUsers/> 90
                </div>
            </div>
          </div>
      </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
        <div className='bg-white p-4 md:p-6 rounded-sm shadow-sm'>
          <h3 className='bg-blue-500 text-white shadow-inner p-2 rounded-sm text-center'>Son Katılımlar</h3>
          <table className='w-full text-center'>
           <thead className='border-b-2  border-slate-200 [&>tr>th]:p-4'>
            <tr>
              <th>Katılan</th>
              <th>Anket</th>
              <th>Zaman</th>
            </tr>
           </thead>
           <tbody className='[&>tr>td]:p-4'>
            <tr>
              <td>Anonim</td>
              <td>Oyunların...</td>
              <td>2dk önce</td>
            </tr>
            <tr>
              <td>Anonim</td>
              <td>Oyunların...</td>
              <td>2dk önce</td>
            </tr>
            <tr>
              <td>Anonim</td>
              <td>Oyunların...</td>
              <td>2dk önce</td>
            </tr>
            <tr>
              <td>Anonim</td>
              <td>Oyunların...</td>
              <td>2dk önce</td>
            </tr>
           </tbody>
          </table>
        </div>
        <div className='bg-white p-4 md:p-6 rounded-sm shadow-sm'>
          <h3 className='bg-rose-500 text-white shadow-inner rounded-sm text-center p-2'>Bildirimler</h3>
          <div className='flex flex-col gap-2 mt-3'>
            <div className='flex flex-row gap-2 items-center'>
              <Image src={"/logo.png"} width={50} height={50} className='rounded-full' alt='logo'/>
              <div>
                <p className='text-sm text-gray-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, dolores?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
