import { addIcons } from 'ionicons'
import { defineCustomElement } from 'ionicons/components/ion-icon'
import {
    checkmarkOutline,
    chatbubbleOutline,
    chevronBackOutline,
    chevronForwardOutline,
    closeCircleOutline,
    closeOutline,
    createOutline,
    ellipsisVerticalOutline,
    heart,
    happyOutline,
    heartOutline,
    helpCircleOutline,
    homeOutline,
    imageOutline,
    lockClosedOutline,
    lockOpenOutline,
    logOutOutline,
    newspaperOutline,
    notificationsOutline,
    pencilOutline,
    peopleOutline,
    personAddOutline,
    personCircleOutline,
    personRemoveOutline,
    phonePortraitOutline,
    searchOutline,
    settingsOutline,
    trashOutline,
} from 'ionicons/icons'

/**
 * Registra o web component <ion-icon> e embute apenas os ícones usados (sem CDN e sem
 * buscar SVGs em runtime). Para usar um ícone novo, importe-o acima e adicione abaixo (a chave é o nome em kebab-case).
 */
export function registerIcons(): void {
    addIcons({
        'checkmark-outline': checkmarkOutline,
        'chatbubble-outline': chatbubbleOutline,
        'chevron-back-outline': chevronBackOutline,
        'chevron-forward-outline': chevronForwardOutline,
        'close-circle-outline': closeCircleOutline,
        'close-outline': closeOutline,
        'create-outline': createOutline,
        'ellipsis-vertical-outline': ellipsisVerticalOutline,
        'heart': heart,
        'happy-outline': happyOutline,
        'heart-outline': heartOutline,
        'help-circle-outline': helpCircleOutline,
        'home-outline': homeOutline,
        'image-outline': imageOutline,
        'lock-closed-outline': lockClosedOutline,
        'lock-open-outline': lockOpenOutline,
        'log-out-outline': logOutOutline,
        'newspaper-outline': newspaperOutline,
        'notifications-outline': notificationsOutline,
        'pencil-outline': pencilOutline,
        'people-outline': peopleOutline,
        'person-add-outline': personAddOutline,
        'person-circle-outline': personCircleOutline,
        'person-remove-outline': personRemoveOutline,
        'phone-portrait-outline': phonePortraitOutline,
        'search-outline': searchOutline,
        'settings-outline': settingsOutline,
        'trash-outline': trashOutline,
    })
    defineCustomElement()
}
