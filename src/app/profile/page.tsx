import { db } from "~/lib/db/db"
import { user } from "~/lib/db/migrations/schema"

export default async function ProfilePage () {
    const allUsers = await db.select().from(user)
    console.log(allUsers)
  return (
    <>Профиль</>
  )
}