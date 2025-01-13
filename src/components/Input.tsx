import { Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof InputField> & {
    errorMessage?: string | null
    isInvalid?: boolean
    isReadOnly?: boolean
}

export function Input({ isReadOnly = false, errorMessage = null, isInvalid = false, ...rest }: Props) {

    const invalid = !!errorMessage || isInvalid

    return (
        <FormControl isInvalid={invalid} mb={"$4"} w={"$full"}>
            <GluestackInput
                isInvalid={isInvalid}
                h={"$14"}
                borderWidth={"$0"}
                borderRadius={"$md"}
                $invalid={{
                    borderWidth: 1,
                    borderColor: "$red500"
                }}
                $focus={{
                    borderWidth: 1,
                    borderColor: invalid ? "$red500" : "$green500"
                }}
                isReadOnly={isReadOnly} //desabilitar o input
                opacity={isReadOnly ? 0.5 : 1}
            >

                <InputField
                    bg="$gray700"
                    borderColor="$gray600"
                    borderWidth={1}
                    color="$white"
                    fontFamily="$body"
                    px={"$4"}
                    placeholderTextColor="$gray300"
                    {...rest}
                />
            </GluestackInput>

            <FormControlError>
                <FormControlErrorText color="$red500">
                    {errorMessage}
                </FormControlErrorText>
            </FormControlError>

        </FormControl>
    )
}