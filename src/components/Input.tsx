import { Input as GluestackInput, InputField } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof InputField> & {
    isReadOnly?: boolean
}

export function Input({ isReadOnly = false, ...rest }: Props) {
    return (
        <GluestackInput
            h={"$14"}
            borderWidth={"$0"}
            borderRadius={"$md"} 
            $focus={{
                borderWidth: 1,
                borderColor: "$green500"
            }}
            isReadOnly = {isReadOnly} //desabilitar o input
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
    )
}