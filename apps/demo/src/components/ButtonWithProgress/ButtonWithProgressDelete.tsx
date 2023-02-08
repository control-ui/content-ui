import React from 'react'
import { useTranslation } from 'react-i18next'
import IcDelete from '@mui/icons-material/Delete'
import IcDeleteOutline from '@mui/icons-material/DeleteOutline'
import { ButtonProgress, ButtonProgressProps } from '@ui-controls/progress/ButtonProgress'
import { ButtonProps } from '@mui/material/Button'

export type ButtonProgressDeleteProps = Omit<ButtonProgressProps, 'confirmClick' | 'confirmClickInitialIcon' | 'confirmClickConfirmIcon'> & Omit<ButtonProps, 'onClick'>

export const ButtonProgressDelete: React.ComponentType<ButtonProgressDeleteProps> = (props) => {
    const {t} = useTranslation('common', {useSuspense: false})

    return <ButtonProgress
        {...props}
        confirmText={t('labels.confirm-click')}
        endIcon={<IcDeleteOutline fontSize={'inherit'}/>}
        confirmIcon={<IcDelete fontSize={'inherit'}/>}
    >
        {t('labels.delete')}
    </ButtonProgress>
}
