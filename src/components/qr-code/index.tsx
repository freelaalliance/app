/* eslint-disable react-hooks/exhaustive-deps */
import { Scanner } from '@yudiel/react-qr-scanner'

interface LeitorQrCodeProps {
  setDadosQrCode: (resultado: string) => void
}

export function LeitorQrCode({ setDadosQrCode }: LeitorQrCodeProps) {
  return (
    <Scanner
      formats={['qr_code']}
      onScan={(result) => {
        setDadosQrCode(result[0].rawValue)
      }}
      scanDelay={2000}
    />
  )
}
