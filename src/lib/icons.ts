import { addIcons } from 'ionicons'
import { defineCustomElement } from 'ionicons/components/ion-icon'
import {
    checkmarkOutline,
    chatbubbleOutline,
    chevronBackOutline,
    closeCircleOutline,
    closeOutline,
    createOutline,
    ellipsisVerticalOutline,
    heart,
    heartOutline,
    homeOutline,
    imageOutline,
    lockClosedOutline,
    logOutOutline,
    notificationsOutline,
    peopleOutline,
    personAddOutline,
    personCircleOutline,
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
        'close-circle-outline': closeCircleOutline,
        'close-outline': closeOutline,
        'create-outline': createOutline,
        'ellipsis-vertical-outline': ellipsisVerticalOutline,
        'heart': heart,
        'heart-outline': heartOutline,
        'home-outline': homeOutline,
        'image-outline': imageOutline,
        'lock-closed-outline': lockClosedOutline,
        'log-out-outline': logOutOutline,
        'notifications-outline': notificationsOutline,
        'people-outline': peopleOutline,
        'person-add-outline': personAddOutline,
        'person-circle-outline': personCircleOutline,
        'phone-portrait-outline': phonePortraitOutline,
        'search-outline': searchOutline,
        'settings-outline': settingsOutline,
        'trash-outline': trashOutline,
    })
    defineCustomElement()
}
