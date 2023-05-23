"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function LoginForm({
  clientEmail,
  callbackUrl,
}: {
  clientEmail?: string
  callbackUrl?: string
}) {
  const [email, setEmail] = useState<string>(String(clientEmail))
  const [emailError, setEmailError] = useState<string>("")
  const [emailIsSent, setEmailIsSet] = useState<boolean>(!!clientEmail)

  const [loading, setLoading] = useState<boolean>(false)

  const [counter, setCounter] = useState(0)

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
  }, [counter])

  useEffect(() => {
    if (counter <= 0) {
      setCounter(10)
    }
  }, [clientEmail])

  const sendEmail = async () => {
    setLoading(true)
    try {
      const result = await signIn("email", { email, redirect: false })
      setEmailIsSet(true)
      console.log(result)
    } catch (e: any) {
      console.error(e)
      setEmailError(e?.message)
    }
    setLoading(false)
  }

  const router = useRouter()

  const { status } = useSession()

  if (status === "authenticated") callbackUrl && router.push(callbackUrl)

  if (status === "loading" || status === "authenticated") return <p>Loading</p>

  return (
    <>
      {!emailIsSent && (
        <>
          <p>email</p>
          <input
            type="text"
            maxLength={100}
            onChange={(e) => {
              setEmailError("")
              setEmail(e.target.value)
            }}
            disabled={loading}
          />
          <button onClick={sendEmail}>Получить ссылку для входа</button>
        </>
      )}
      {emailIsSent && (
        <>
          <p>Ссылка отправлена на ваш e-mail!</p>
          <p>Если письмо не пришло, проверьте папку «Спам».</p>
          <button
            disabled={counter > 0}
            onClick={() => {
              setEmailIsSet(false)
              setEmail("")
              setEmailError("")
            }}
          >
            Отправить ссылку на другой e-mail {counter > 0 && `(${counter})`}
          </button>
        </>
      )}
    </>
  )
}
