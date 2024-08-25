import { format } from 'date-fns';
import Header from '../_components/header';
import { da, ptBR } from 'date-fns/locale';
import Search from './_components/search';
import BookingItem from '../_components/booking-item';
import BarbershopItem from './_components/barbershop-item';
import { db } from '../_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../_lib/auth';

export default async function Home() {

  const session = await getServerSession(authOptions);

  const [barbershops, recommendedBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    db.barbershop.findMany({
      orderBy: {
        id: 'desc'
      }
    }),
    session?.user ? db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      },
      orderBy: {
        date: 'asc'
      }
    })
      : Promise.resolve([])
  ])

  return (
    <div>
      <Header />

      <div className='pt-5 px-5'>
        <h2 className='text-xl font-bold'>Olá, {session?.user?.name ? `${session.user.name.split(' ')[0]}!` : 'vamos agendar um corte hoje?'}</h2>
        <p className='capitalize text-sm'>
          {format(new Date(), "EEEE',' dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      <div className='px-5 mt-4'>
        <Search />
      </div>

      {confirmedBookings.length > 0 && (
        <div className="px-5 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <h2 className='text-sm uppercase text-gray-400 font-bold mb-3'>AGENDAMENTOS</h2>
          <div className="flex gap-3">
            {confirmedBookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      <div className='mt-6'>
        <h2 className='px-5 text-sm uppercase text-gray-400 font-bold mb-3'>Recomendados</h2>

        <div className='px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
          {barbershops.map((barbershop: any) => (
            <div key={barbershop.id} className='min-w-[167px] max-w-[167px]'>
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6 mb-[2.5rem]'>
        <h2 className='px-5 text-sm uppercase text-gray-400 font-bold mb-3'>Populares</h2>

        <div className='px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
          {recommendedBarbershops.map((barbershop: any) => (
            <div key={barbershop.id} className='min-w-[167px] max-w-[167px]'>
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
