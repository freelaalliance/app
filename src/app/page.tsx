import Image from 'next/image'

import { FormularioAutenticacao } from '@/components/auth/form/FormularioAutenticacao'
import { Card, CardContent } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export default function Auth() {
	return (
		<div className="min-h-screen flex">
			{/* Left Panel - Branding and Features */}
			<div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground xl:px-50 p-12 flex-row items-center lg:justify-center relative z-10 shadow-[24px_0px_32px_-5px_rgba(0,0,0,0.3)]">
				<div className="max-w-lg">
					<div className="flex items-center gap-3 mb-8">
						<div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
							<Building2 className="w-6 h-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-2xl font-bold">Alliance ERP</h1>
							<p className="text-primary-foreground/80 text-sm">
								Sistema de Gestão Empresarial
							</p>
						</div>
					</div>

					<h2 className="text-3xl font-bold mb-4 leading-tight">
						Gerencie sua empresa com segurança e eficiência
					</h2>

					<p className="text-primary-foreground/90 mb-8 leading-relaxed">
						Plataforma completa para controle e gestão de processos empresariais.
					</p>

					<div className="space-y-4">
						<Image
							src="/banner-login.jpg"
							alt="Alliance ERP - Certificações ISO e Gestão Empresarial"
							width={450}
							height={320}
							className="rounded-2xl shadow-xl object-cover"
							priority
						/>
					</div>
				</div>
			</div>

			{/* Right Panel - Login Form */}
			<div className="flex-1 flex items-center bg-white lg:bg-gray-50 justify-center p-2 md:p-4 lg:p-8">
				<div className="w-full max-w-md">
					{/* Mobile Header */}
					<div className="lg:hidden text-center mb-8">
						<Image
							src="/logo_alliance_colorido.png"
							alt="Alliance ERP - Certificações ISO e Gestão Empresarial"
							width={250}
							height={250}
							className="mx-auto"
							priority
						/>
					</div>

					{/* Login Card */}
					<Card className="border-primary lg:border-muted lg:bg-card shadow-2xl">
						<CardContent className="p-8">
							<div className="text-center mb-6">
								<h2 className="text-2xl font-semibold text-card-foreground mb-2">
									Bem-vindo de volta
								</h2>
								<p className="text-muted-foreground">Entre com suas credenciais para continuar</p>
							</div>

							<FormularioAutenticacao />

							<div className="mt-6 pt-6 border-t border-border">
								<p className="text-xs text-center text-muted-foreground">
									© 2025 Alliance Sistemas de Gestão
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
