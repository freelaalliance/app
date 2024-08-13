import Image from 'next/image'

import { FormularioAutenticacao } from '@/components/auth/form/FormularioAutenticacao'

export default function Auth() {
  return (
    <main className="flex flex-row h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className="max-w-md text-center">
          <Image
            src={'/access_account.svg'}
            alt="SVG Autenticação Alliance sistemas de gestão"
            width={'531'}
            height={'531'}
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full lg:w-2/5 py-6 flex flex-col items-center justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-1 sm:inset-0 bg-gradient-to-r from-red-300 to-padrao-red shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl rounded"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 rounded">
            <div className="max-w-md mx-auto">
              <div>
                <Image
                  loading="lazy"
                  src={'/logo_alliance_colorido.png'}
                  alt="Logo Alliance Sistemas de Gestão"
                  width={250}
                  height={250}
                />
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <FormularioAutenticacao />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
