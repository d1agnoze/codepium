"use server"
export async function addMetadata(formData: FormData) {
    console.log(formData.get('expertise'));

    const data = {
        about: formData.get('about') ? formData.get('about') : '',
        user_name: formData.get('username') ? formData.get('username') : '',
        display_name: formData.get('displayName') ? formData.get('displayName') : '',
    }
    console.log(data);
}
export async function setExpertise(formData: FormData) {
    if (formData.get('data') != null) {
        const selected = JSON.parse(formData.get('data')?.toString()!)
        console.log(selected);

    }
}