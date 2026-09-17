import SponsorForm from '../../../../../components/admin/SponsorForm.js'

export default function NewSponsorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">New sponsor</h1>
      <SponsorForm mode="create" />
    </div>
  )
}
