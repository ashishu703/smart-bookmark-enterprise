import { useId, useState } from "react"
import { Button } from "../atoms/Button"
import { Input } from "../atoms/Input"
import { FormField } from "../molecules/FormField"

export function BookmarkForm({ onSubmit, loading }) {
  const titleId = useId()
  const urlId = useId()

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({ title: title.trim(), url: url.trim() })
    setTitle("")
    setUrl("")
  }

  const disabled = loading || !title.trim() || !url.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add bookmark form">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" htmlFor={titleId}>
          <Input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ChatGPT"
            autoComplete="off"
            required
          />
        </FormField>

        <FormField label="URL" htmlFor={urlId}>
          <Input
            id={urlId}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://chatgpt.com"
            inputMode="url"
            required
          />
        </FormField>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Add
        </Button>
      </div>
    </form>
  )
}
