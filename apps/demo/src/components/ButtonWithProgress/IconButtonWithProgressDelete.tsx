import React from 'react'
import { useTranslation } from 'react-i18next'
import IcDelete from '@mui/icons-material/Delete'
import IcDeleteOutline from '@mui/icons-material/DeleteOutline'
import { IconButtonProgress, IconButtonProgressProps } from '@ui-controls/progress/IconButtonProgress'
import { IconButtonProps } from '@mui/material/IconButton'

export const IconButtonProgressDelete: React.ComponentType<Omit<IconButtonProgressProps, 'toolTipConfirm' | 'tooltip' | 'confirmClick' | 'confirmClickInitialIcon' | 'confirmClickConfirmIcon'> & Omit<IconButtonProps, 'onClick'>> = (props) => {
    const {t} = useTranslation('common', {useSuspense: false})

    return <IconButtonProgress
        {...props}
        tooltipConfirm={t('labels.confirm-click')}
        tooltip={t('labels.delete')}
        confirmIcon={<IcDelete fontSize={'inherit'}/>}
    >
        <IcDeleteOutline fontSize={'inherit'}/>
    </IconButtonProgress>
}
