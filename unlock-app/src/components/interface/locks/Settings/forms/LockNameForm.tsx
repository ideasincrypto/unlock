import { useMutation } from '@tanstack/react-query'
import { Button, Input } from '@unlock-protocol/ui'
import { useForm } from 'react-hook-form'
import { FaSpinner as Spinner } from 'react-icons/fa'
import { ToastHelper } from '~/components/helpers/toast.helper'
import { useWalletService } from '~/utils/withWalletService'

interface LockNameFormProps {
  disabled: boolean
  isManager: boolean
  lockAddress: string
  lockName: string
}

interface FormProps {
  name: string
}

export const LockNameForm = ({
  disabled,
  isManager,
  lockAddress,
  lockName,
}: LockNameFormProps) => {
  const walletService = useWalletService()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<FormProps>({
    defaultValues: {
      name: lockName,
    },
  })

  const changeName = async (name: string) => {
    return await walletService.updateLockName({
      lockAddress,
      name,
    })
  }

  const changeNameMutation = useMutation(changeName)

  const onChangeName = async ({ name }: FormProps) => {
    if (!isManager) return
    if (isValid) {
      const changeNamePromise = changeNameMutation.mutateAsync(name)
      await ToastHelper.promise(changeNamePromise, {
        loading: 'Updating lock name.',
        success: 'Lock name updated.',
        error: 'There is an issue updating the lock name.',
      })
      reset()
    } else {
      ToastHelper.error('Form is not valid.')
    }
  }

  const disabledInput = disabled || changeNameMutation.isLoading
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onChangeName)}>
      <div className="relative">
        <Input
          {...register('name', {
            minLength: 3,
          })}
          autoComplete="off"
          disabled={disabledInput}
        />
        {errors?.name && (
          <span className="absolute text-xs text-red-700">
            Lock name should have at least 3 characters.
          </span>
        )}
      </div>

      <Button
        type="submit"
        className="w-full md:w-1/3"
        disabled={disabledInput}
      >
        <div className="flex items-center gap-2">
          <span>Update</span>
          {changeNameMutation.isLoading && (
            <Spinner className="mr-1 animate-spin" />
          )}
        </div>
      </Button>
    </form>
  )
}
