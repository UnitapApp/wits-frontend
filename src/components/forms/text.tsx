"use client"

import { Controller } from "react-hook-form"
import { Input } from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"

const TextInput: FC<InputBaseType> = ({
  control,
  name,
  label,
  className,
  rules,
}) => {
  const validations = useMemo(() => {
    const obj: Record<string, any> = {}

    rules?.forEach((rule) => {
      obj[rule.type] = rule.value
    })

    return obj
  }, [rules])

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Input
          name={name}
          value={field.value ?? ""}
          onChange={field.onChange}
          label={label}
          variant="bordered"
          className={className}
          errorMessage={fieldState.error?.message}
        />
      )}
      name={name}
      control={control}
      rules={validations}
    />
  )
}

export default TextInput
