'use client'

import { useState, useRef, useTransition } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Megaphone, Plus, Search, MoreVertical, Edit, Trash2, CalendarClock,
    TrendingUp, ImageIcon, X, Upload, Loader2, Power, PowerOff, AlertTriangle
} from 'lucide-react'
import { createAdAction } from '@/actions/ads/create-ad.action'
import { deleteAdAction } from '@/actions/ads/delete-ad.action'
import { updateAdAction } from '@/actions/ads/update-ad.action'
import { toggleAdStatusAction } from '@/actions/ads/toggle-ad-status.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AdItem = { id: string; imageUrl: string | null; text: string | null; position: number }
type Ad = {
    id: string
    title: string
    text: string | null
    active: boolean
    createdAt: Date
    items: AdItem[]
}

type SelectedImage = {
    type: 'new' | 'existing'
    file?: File
    url?: string
    preview: string
    caption: string
}

interface AdsClientProps {
    initialAds: Ad[]
}

export function AdsClient({ initialAds }: AdsClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [adToDelete, setAdToDelete] = useState<Ad | null>(null)

    // Estados do Form
    const [editingAdId, setEditingAdId] = useState<string | null>(null)
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const filteredAds = initialAds.filter((ad) =>
        ad.title.toLowerCase().includes(search.toLowerCase()) ||
        (ad.text ?? '').toLowerCase().includes(search.toLowerCase())
    )

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        const newImages: SelectedImage[] = files.map((file) => ({
            type: 'new',
            file,
            preview: URL.createObjectURL(file),
            caption: '',
        }))
        setSelectedImages((prev) => [...prev, ...newImages])
        e.target.value = ''
    }

    function removeImage(index: number) {
        setSelectedImages((prev) => {
            const img = prev[index]
            if (img.type === 'new') URL.revokeObjectURL(img.preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    function updateCaption(index: number, caption: string) {
        setSelectedImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, caption } : img))
        )
    }

    function resetDialog() {
        selectedImages.forEach((img) => {
            if (img.type === 'new') URL.revokeObjectURL(img.preview)
        })
        setSelectedImages([])
        setTitle('')
        setDescription('')
        setEditingAdId(null)
        setOpenDialog(false)
    }

    function handleEdit(ad: Ad) {
        setTitle(ad.title)
        setDescription(ad.text ?? '')
        setEditingAdId(ad.id)

        const existingImages: SelectedImage[] = ad.items.map(item => ({
            type: 'existing',
            url: item.imageUrl!,
            preview: item.imageUrl!,
            caption: item.text ?? ''
        }))
        setSelectedImages(existingImages)
        setOpenDialog(true)
    }

    function handleSave() {
        if (!title.trim()) { toast.error('Digite um título para o anúncio.'); return }
        if (!selectedImages.length) { toast.error('Adicione pelo menos uma imagem.'); return }

        const formData = new FormData()
        formData.append('title', title.trim())
        if (description.trim()) formData.append('text', description.trim())

        // Na criação as actions usavam arrays simples, na edição é mais complexo
        if (editingAdId) {
            formData.append('id', editingAdId)
            formData.append('itemsLength', selectedImages.length.toString())
            selectedImages.forEach((img, i) => {
                formData.append(`items[${i}].type`, img.type)
                if (img.caption.trim()) formData.append(`items[${i}].caption`, img.caption.trim())

                if (img.type === 'new' && img.file) {
                    formData.append(`items[${i}].file`, img.file)
                } else if (img.type === 'existing' && img.url) {
                    formData.append(`items[${i}].url`, img.url)
                }
            })
        } else {
            // Fluxo de criação antigo
            selectedImages.forEach((img, i) => {
                if (img.file) formData.append('images', img.file)
                if (img.caption.trim()) formData.append(`captions[${i}]`, img.caption.trim())
            })
        }

        startTransition(async () => {
            try {
                if (editingAdId) {
                    await updateAdAction(formData)
                    toast.success('Anúncio atualizado com sucesso!')
                } else {
                    await createAdAction(formData)
                    toast.success('Anúncio criado com sucesso!')
                }
                resetDialog()
                router.refresh()
            } catch (err: any) {
                toast.error(err?.message ?? `Erro ao ${editingAdId ? 'atualizar' : 'criar'} anúncio.`)
            }
        })
    }

    function confirmDelete() {
        if (!adToDelete) return
        const id = adToDelete.id
        setDeletingId(id)
        startTransition(async () => {
            try {
                await deleteAdAction(id)
                toast.success('Anúncio excluído com sucesso!')
                setAdToDelete(null)
                router.refresh()
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Erro ao excluir anúncio.')
            } finally {
                setDeletingId(null)
            }
        })
    }

    function handleToggleStatus(ad: Ad) {
        setTogglingId(ad.id)
        startTransition(async () => {
            try {
                await toggleAdStatusAction(ad.id, ad.active)
                toast.success(`Anúncio ${ad.active ? 'desativado' : 'ativado'} com sucesso!`)
                router.refresh()
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Erro ao alterar status')
            } finally {
                setTogglingId(null)
            }
        })
    }
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header e Dados mantidos iguais */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Anúncios</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        Crie e gerencie as mensagens dos seus disparos automáticos.
                    </p>
                </div>
                <Button
                    onClick={() => setOpenDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-900/30 text-white gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Novo Anúncio
                </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    { label: 'Total de Anúncios', value: initialAds.length, icon: Megaphone, color: 'text-violet-400', bg: 'from-violet-600/10 to-violet-600/5', border: 'border-violet-600/20' },
                    { label: 'Anúncios Ativos', value: initialAds.length, icon: TrendingUp, color: 'text-emerald-400', bg: 'from-emerald-600/10 to-emerald-600/5', border: 'border-emerald-600/20' },
                    { label: 'Agendamentos', value: 0, icon: CalendarClock, color: 'text-blue-400', bg: 'from-blue-600/10 to-blue-600/5', border: 'border-blue-600/20' },
                ].map((s) => (
                    <Card key={s.label} className={`bg-gradient-to-br ${s.bg} border ${s.border}`}>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar anúncios…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-border/60 h-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredAds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground p-6">
                            <Megaphone className="h-10 w-10 mb-3 opacity-20" />
                            <p className="text-sm font-medium">Nenhum anúncio encontrado</p>
                            <p className="text-xs mt-1 text-center">Crie seu primeiro anúncio usando o botão acima.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                            {filteredAds.map((ad) => {
                                const firstImage = ad.items[0]?.imageUrl
                                const isDeleting = deletingId === ad.id
                                const isToggling = togglingId === ad.id
                                return (
                                    <div
                                        key={ad.id}
                                        className="flex flex-col relative rounded-xl overflow-hidden border border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all group"
                                    >
                                        {/* Ações / Dropdown (Absoluto no topo direito) */}
                                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-background">
                                                        <MoreVertical className="h-3.5 w-3.5 text-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="border-border">
                                                    <DropdownMenuItem className="gap-2 text-xs">
                                                        <CalendarClock className="h-3.5 w-3.5" />
                                                        Novo Agendamento
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-xs"
                                                        onClick={() => handleToggleStatus(ad)}
                                                        disabled={isToggling}
                                                    >
                                                        {isToggling ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : ad.active ? (
                                                            <PowerOff className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Power className="h-3.5 w-3.5" />
                                                        )}
                                                        {ad.active ? 'Desativar' : 'Ativar'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-xs"
                                                        onClick={() => handleEdit(ad)}
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <Separator className="my-1" />
                                                    <DropdownMenuItem
                                                        className="gap-2 text-xs text-destructive focus:text-destructive"
                                                        onClick={() => setAdToDelete(ad)}
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting
                                                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            : <Trash2 className="h-3.5 w-3.5" />
                                                        }
                                                        {isDeleting ? 'Excluindo…' : 'Excluir'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Imagem Cover */}
                                        <div className="w-full aspect-video bg-muted/40 relative sm:aspect-square md:aspect-[4/3]">
                                            {firstImage ? (
                                                <img
                                                    src={firstImage}
                                                    alt={ad.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-blue-600/10 to-violet-600/10">
                                                    <Megaphone className="h-8 w-8 text-primary/40" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Conteúdo / Textos */}
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <p className="text-sm font-semibold leading-tight line-clamp-1 flex-1" title={ad.title}>
                                                    {ad.title}
                                                </p>
                                                {ad.active ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] px-1 py-0 h-4 border bg-emerald-400/10 border-emerald-400/20 text-emerald-400 font-medium whitespace-nowrap"
                                                    >
                                                        Ativo
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] px-1 py-0 h-4 border bg-muted/30 border-muted-foreground/30 text-muted-foreground font-medium whitespace-nowrap"
                                                    >
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </div>

                                            {ad.text && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                                                    {ad.text}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/60">
                                                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                                    <ImageIcon className="h-3.5 w-3.5" />
                                                    {ad.items.length} {ad.items.length === 1 ? 'img' : 'imgs'}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/60 font-medium">
                                                    {new Date(ad.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={(open) => { if (!open) resetDialog(); else setOpenDialog(true) }}>
                <DialogContent className="sm:max-w-xl border-border bg-card max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold">
                            {editingAdId ? 'Editar Anúncio' : 'Criar Novo Anúncio'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
                        <div className="space-y-1.5">
                            <Label htmlFor="ad-title" className="text-sm text-muted-foreground">
                                Título <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="ad-title"
                                placeholder="Ex: Black Friday Shopee"
                                className="bg-muted/30 border-border/60"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ad-text" className="text-sm text-muted-foreground">
                                Cópia Final (Texto) <span className="text-muted-foreground/50 font-normal">(opcional)</span>
                            </Label>
                            <Textarea
                                id="ad-text"
                                placeholder="Texto enviado logo após as imagens. Ex: Link da oferta, informações adicionais..."
                                rows={3}
                                className="bg-muted/30 border-border/60 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground/70">
                                Este texto será a <strong>última coisa enviada</strong> no WhatsApp, após todas as imagens.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">
                                    Imagens <span className="text-destructive">*</span>
                                </Label>
                                <span className="text-[11px] text-muted-foreground/60">
                                    {selectedImages.length} {selectedImages.length === 1 ? 'imagem' : 'imagens'} selecionada{selectedImages.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-muted-foreground group"
                            >
                                <Upload className="h-5 w-5 group-hover:text-primary transition-colors" />
                                <span className="text-xs">Clique para adicionar imagens</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {selectedImages.length > 0 && (
                                <div className="space-y-2">
                                    {selectedImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Imagem ${index + 1}`}
                                                className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <p className="text-[11px] text-muted-foreground font-medium truncate">
                                                    {img.type === 'new' ? img.file?.name : 'Imagem Cadastrada'}
                                                </p>
                                                <Input
                                                    placeholder="Legenda da imagem (opcional)"
                                                    className="h-8 text-xs bg-muted/30 border-border/60"
                                                    value={img.caption}
                                                    onChange={(e) => updateCaption(index, e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2 border-t border-border">
                        <Button variant="outline" onClick={resetDialog} className="border-border" disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0"
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Salvando…
                                </>
                            ) : (
                                editingAdId ? 'Salvar Alterações' : 'Criar Anúncio'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog open={adToDelete !== null} onOpenChange={(open) => !open && setAdToDelete(null)}>
                <AlertDialogContent className="border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Excluir Anúncio
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o anúncio <strong>"{adToDelete?.title}"</strong>?
                            Essa ação não tem volta. Todas as imagens associadas e arquivos deste anúncio serão deletados permanentemente do servidor.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingId !== null}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); confirmDelete(); }}
                            disabled={deletingId !== null}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {deletingId ? 'Excluindo...' : 'Sim, excluir permanentemente'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
