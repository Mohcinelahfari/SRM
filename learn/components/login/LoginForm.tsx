// // // // "use client"
 
// // // // import { zodResolver } from "@hookform/resolvers/zod"
// // // // import { useForm } from "react-hook-form"
// // // // import { z } from "zod"
 
// // // // import { Button } from "@/components/ui/button"
// // // // import {
// // // //   Form,
// // // //   FormControl,
// // // //   FormDescription,
// // // //   FormField,
// // // //   FormItem,
// // // //   FormLabel,
// // // //   FormMessage,
// // // // } from "@/components/ui/form"
// // // // import { Input } from "@/components/ui/input"
// // // // import axiosClient from "@/lib/api/axiosClient"
// // // // import { useRouter } from "next/navigation"
 
// // // // const formSchema = z.object({
// // // //   email: z.string().min(2, {
// // // //     message: "Username must be at least 2 characters.",
// // // //   }),
// // // //   password : z.string().min(1)
// // // // })

// // // //  function LoginForm() {
// // // //     const router = useRouter()

// // // //     const form = useForm<z.infer<typeof formSchema>>({
// // // //     resolver: zodResolver(formSchema),
// // // //     defaultValues: {
// // // //       email: "",
// // // //       password : ""
// // // //     },
// // // //   })

// // // //   const  onSubmit = async (values: z.infer<typeof formSchema>) => {
// // // //     try {
// // // //         const data = await axiosClient.post('/user/login', values)
// // // //         router.push('/')
// // // //         console.log(data);

        
// // // //     } catch (error) {   
// // // //         console.log(error);
        
// // // //     }
// // // //   }
// // // //    return (
// // // //      <Form {...form}>
// // // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
// // // //         <FormField
// // // //           control={form.control}
// // // //           name="email"
// // // //           render={({ field }) => (
// // // //             <FormItem>
// // // //               <FormLabel>email</FormLabel>
// // // //               <FormControl>
// // // //                 <Input placeholder="shadcn" {...field} />
// // // //               </FormControl>
// // // //               <FormDescription>
// // // //                 This is your public display name.
// // // //               </FormDescription>
// // // //               <FormMessage />
// // // //             </FormItem>
// // // //           )}
// // // //         />
// // // //         <FormField
// // // //           control={form.control}
// // // //           name="password"
// // // //           render={({ field }) => (
// // // //             <FormItem>
// // // //               <FormLabel>password</FormLabel>
// // // //               <FormControl>
// // // //                 <Input placeholder="shadcn" {...field} />
// // // //               </FormControl>
// // // //               <FormDescription>
// // // //                 This is your public display name.
// // // //               </FormDescription>
// // // //               <FormMessage />
// // // //             </FormItem>
// // // //           )}
// // // //         />
// // // //         <Button type="submit">Submit</Button>
// // // //       </form>
// // // //     </Form>
// // // //    )
// // // //  }
 
// // // //  export default LoginForm


// // // "use client"

// // // import { zodResolver } from "@hookform/resolvers/zod"
// // // import { useForm } from "react-hook-form"
// // // import { z } from "zod"
// // // import { useRouter } from "next/navigation"
// // // import { toast } from "sonner"

// // // import { Button } from "@/components/ui/button"
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormDescription,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from "@/components/ui/form"
// // // import { Input } from "@/components/ui/input"
// // // import axiosClient from "@/lib/api/axiosClient"

// // // // Validation schema
// // // const formSchema = z.object({
// // //   email: z.string().email({ message: "Adresse e-mail invalide" }),
// // //   password: z.string().min(1, { message: "Mot de passe requis" }),
// // // })

// // // export default function LoginForm() {
// // //   const router = useRouter()

// // //   const form = useForm<z.infer<typeof formSchema>>({
// // //     resolver: zodResolver(formSchema),
// // //     defaultValues: {
// // //       email: "",
// // //       password: "",
// // //     },
// // //   })

// // //   const onSubmit = async (values: z.infer<typeof formSchema>) => {
// // //     form.clearErrors()
// // //     try {
// // //       const response = await axiosClient.post(
// // //         "/user/login",
// // //         values,
// // //         { withCredentials: true }
// // //       )

// // //       toast.success("Connexion réussie !")
// // //       const { isAdmin } = response.data.user
// // //       console.log(response);
      
// // //       if (isAdmin) {
// // //         router.push("/admin")
// // //       } else {
// // //         router.push("/employee")
// // //       }
// // //     } catch (error: any) {
// // //       const message = error.response?.data?.message || "Erreur de connexion"
// // //       toast.error(message)
// // //     }
// // //   }

// // //   return (
// // //     <Form {...form}>
// // //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// // //         <FormField
// // //           control={form.control}
// // //           name="email"
// // //           render={({ field }) => (
// // //             <FormItem>
// // //               <FormLabel>Email</FormLabel>
// // //               <FormControl>
// // //                 <Input placeholder="email@example.com" {...field} />
// // //               </FormControl>
// // //               <FormMessage />
// // //             </FormItem>
// // //           )}
// // //         />

// // //         <FormField
// // //           control={form.control}
// // //           name="password"
// // //           render={({ field }) => (
// // //             <FormItem>
// // //               <FormLabel>Mot de passe</FormLabel>
// // //               <FormControl>
// // //                 <Input type="password" placeholder="••••••••" {...field} />
// // //               </FormControl>
// // //               <FormMessage />
// // //             </FormItem>
// // //           )}
// // //         />

// // //         <Button type="submit" disabled={form.formState.isSubmitting}>
// // //           {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
// // //         </Button>
// // //       </form>
// // //     </Form>
// // //   )
// // // }



// // "use client"

// // import { zodResolver } from "@hookform/resolvers/zod"
// // import { useForm } from "react-hook-form"
// // import { z } from "zod"
// // import { useRouter } from "next/navigation"
// // import { toast } from "sonner"

// // import { Button } from "@/components/ui/button"
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form"
// // import { Input } from "@/components/ui/input"
// // import axiosClient from "@/lib/api/axiosClient"
// // import { useEffect } from "react"

// // // Validation schema
// // type LoginValues = {
// //   email: string
// //   password: string
// // }
// // const formSchema = z.object({
// //   email: z.string().email({ message: "Adresse e-mail invalide" }),
// //   password: z.string().min(1, { message: "Mot de passe requis" }),
// // })

// // export default function LoginForm() {
// //   const router = useRouter()

// //   const form = useForm<z.infer<typeof formSchema>>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: { email: "", password: "" },
// //   })

// //   const onSubmit = form.handleSubmit(async (values: LoginValues) => {
// //     form.clearErrors()
// //     try {
// //       const response = await axiosClient.post(
// //         "/user/login",
// //         values,
// //         { withCredentials: true }
// //       )

// //       toast.success("Connexion réussie !")
// //       console.log("connecte");
      
      
// //       useEffect(() => {
// //       const { isAdmin } = response.data.user
// //       console.log(isAdmin);
      
// //       if (isAdmin) {
// //         router.push("/admin")
// //       } else {
// //         router.push("/empl")
// //       }
// //       }, [])
      
// //     } catch (error: any) {
// //       const message = error.response?.data?.message || "Erreur de connexion"
// //       toast.error(message)
// //     }
// //   })

// //   return (
// //     <Form {...form}>
// //       <form onSubmit={onSubmit} className="space-y-6">
// //         <FormField
// //           control={form.control}
// //           name="email"
// //           render={({ field }) => (
// //             <FormItem>
// //               <FormLabel>Email</FormLabel>
// //               <FormControl>
// //                 <Input placeholder="email@example.com" {...field} />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         <FormField
// //           control={form.control}
// //           name="password"
// //           render={({ field }) => (
// //             <FormItem>
// //               <FormLabel>Mot de passe</FormLabel>
// //               <FormControl>
// //                 <Input type="password" placeholder="••••••••" {...field} />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         <Button type="submit" disabled={form.formState.isSubmitting}>
// //           {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
// //         </Button>
// //       </form>
// //     </Form>
// //   )
// // }


// // // "use client"

// // // import { zodResolver } from "@hookform/resolvers/zod"
// // // import { useForm } from "react-hook-form"
// // // import { z } from "zod"
// // // import { useRouter } from "next/navigation"
// // // import { toast } from "sonner"

// // // import { Button } from "@/components/ui/button"
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from "@/components/ui/form"
// // // import { Input } from "@/components/ui/input"
// // // import axiosClient from "@/lib/api/axiosClient"

// // // // Validation schema
// // // type LoginValues = {
// // //   email: string
// // //   password: string
// // // }
// // // const formSchema = z.object({
// // //   email: z.string().email({ message: "Adresse e-mail invalide" }),
// // //   password: z.string().min(1, { message: "Mot de passe requis" }),
// // // })

// // // export default function LoginForm() {
// // //   const router = useRouter()

// // //   const form = useForm<z.infer<typeof formSchema>>({
// // //     resolver: zodResolver(formSchema),
// // //     defaultValues: { email: "", password: "" },
// // //   })

// // //   const onSubmit = form.handleSubmit(async (values: LoginValues) => {
// // //     form.clearErrors()
// // //     try {
// // //       const response = await axiosClient.post(
// // //         "/user/login",
// // //         values,
// // //         { withCredentials: true }
// // //       )

// // //       toast.success("Connexion réussie !")
// // //       const { isAdmin } = response.data.user
// // //       // redirect avec replace pour éviter l'historique
// // //       if (isAdmin) {
// // //         // full reload to ensure cookie is set before layout checks
// // //         window.location.href = "/admin"
// // //       } else {
// // //         window.location.href = "/empl"
// // //       }
// // //     } catch (error: any) {
// // //       const message = error.response?.data?.message || "Erreur de connexion"
// // //       toast.error(message)
// // //     }
// // //   })

// // //   return (
// // //     <Form {...form}>
// // //       <form onSubmit={onSubmit} className="space-y-6">
// // //         <FormField
// // //           control={form.control}
// // //           name="email"
// // //           render={({ field }) => (
// // //             <FormItem>
// // //               <FormLabel>Email</FormLabel>
// // //               <FormControl>
// // //                 <Input placeholder="email@example.com" {...field} />
// // //               </FormControl>
// // //               <FormMessage />
// // //             </FormItem>
// // //           )}
// // //         />

// // //         <FormField
// // //           control={form.control}
// // //           name="password"
// // //           render={({ field }) => (
// // //             <FormItem>
// // //               <FormLabel>Mot de passe</FormLabel>
// // //               <FormControl>
// // //                 <Input type="password" placeholder="••••••••" {...field} />
// // //               </FormControl>
// // //               <FormMessage />
// // //             </FormItem>
// // //           )}
// // //         />

// // //         <Button type="submit" disabled={form.formState.isSubmitting}>
// // //           {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
// // //         </Button>
// // //       </form>
// // //     </Form>
// // //   )
// // // }


// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import axiosClient from "@/lib/api/axiosClient"

// // Validation schema
// type LoginValues = {
//   email: string
//   password: string
// }
// const formSchema = z.object({
//   email: z.string().email({ message: "Adresse e-mail invalide" }),
//   password: z.string().min(1, { message: "Mot de passe requis" }),
// })

// export default function LoginForm() {
//   const router = useRouter()

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { email: "", password: "" },
//   })

//   const onSubmit = form.handleSubmit(async (values: LoginValues) => {
//     form.clearErrors()
//     try {
//       const response = await axiosClient.post(
//         "/user/login",
//         values,
//         { withCredentials: true }
//       )

//       toast.success("Connexion réussie !");
//       // Delay slightly to ensure JWT cookie is persisted before redirecting
//       setTimeout(() => {
//         if (isAdmin) {
//           window.location.href = "/admin";
//         } else {
//           window.location.href = "/employee";
//         }
//       }, 3000);
//       const { isAdmin } = response.data.user
//       // redirect avec replace pour éviter l'historique
//       if (isAdmin) {
//         // full reload to ensure cookie is set before layout checks
//         window.location.href = "/admin"
//       } else {
//         window.location.href = "/employee"
//       }
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Erreur de connexion"
//       toast.error(message)
//     }
//   })

//   return (
//     <Form {...form}>
//       <form onSubmit={onSubmit} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="email@example.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Mot de passe</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="••••••••" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" disabled={form.formState.isSubmitting}>
//           {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
//         </Button>
//       </form>
//     </Form>
//   )
// }


// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import axiosClient from "@/lib/api/axiosClient"

// // Validation schema
// type LoginValues = {
//   email: string
//   password: string
// }
// const formSchema = z.object({
//   email: z.string().email({ message: "Adresse e-mail invalide" }),
//   password: z.string().min(1, { message: "Mot de passe requis" }),
// })

// export default function LoginForm() {
//   const router = useRouter()

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { email: "", password: "" },
//   })

//   const onSubmit = form.handleSubmit(async (values: LoginValues) => {
//     form.clearErrors()
//     try {
//       const response = await axiosClient.post(
//         "user/login",
//         values,
//         { withCredentials: true }
//       )

//       toast.success("Connexion réussie !")

//       // Extract admin flag before redirect
//       const { isAdmin } = response.data.user

//       // Delay to ensure cookie persistence
//       setTimeout(() => {
//         if (isAdmin) {
//           router.push('/admin')
//         } else {
//           router.push('/empl')
//         }
//       }, 1000)
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Erreur de connexion"
//       toast.error(message)
//     }
//   })

//   return (
//     <Form {...form}>
//       <form onSubmit={onSubmit} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="email@example.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Mot de passe</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="••••••••" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" disabled={form.formState.isSubmitting}>
//           {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
//         </Button>
//       </form>
//     </Form>
//   )
// }

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axiosClient from "@/lib/api/axiosClient"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosClient.post("user/login", values, {
        withCredentials: true,
      })

      toast.success("Login successful!")
      
      // Redirect based on user role
      const { isAdmin } = response.data.user
      router.push(isAdmin ? '/admin/' : '/empl/')
      
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-6 mt-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  )
}