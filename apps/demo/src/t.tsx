import { makeTranslator, createMap, Translator } from '@ui-schema/ui-schema'
import { ERROR_EMAIL_INVALID } from '@ui-schema/json-schema/Validators/EmailValidator'
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

const icons = {}

const dicEN = createMap({
    error: {
        ...en.errors,
        [ERROR_EMAIL_INVALID]: 'Enter a valid e-mail address',
    },
    labels: {...en.labels, ...en.richText, ...en.dnd},
    formats: {...en.formats},
    pagination: {...en.pagination},
    // for material-ui only icons which are set manually through schema are needed to add
    icons,
})

const dicDE = createMap({
    error: {
        ...de.errors,
        [ERROR_EMAIL_INVALID]: 'Gebe eine valide E-Mail Adresse ein',
    },
    labels: {...de.labels, ...de.richText, ...de.dnd},
    formats: {...de.formats},
    pagination: {...de.pagination},
    icons,
})

const tEN = makeTranslator(dicEN, 'en')
const tDE = makeTranslator(dicDE, 'de')

export const browserT: Translator = (text, context, schema) => {
    const locale = window.localStorage.getItem('locale') || navigator.language
    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema)
}
