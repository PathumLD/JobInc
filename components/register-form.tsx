"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess("Registration successful!");
      setForm({ email: "", password: "", name: "" });
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}