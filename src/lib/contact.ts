// Central IGS contact info — used by footer, header, consultation, floating widget.
export const IGS_PHONE_DISPLAY = "0917 894 8989";
export const IGS_PHONE_TEL = "+639178948989"; // E.164 for tel: / wa.me
export const IGS_PHONE_WA = "639178948989"; // wa.me requires no '+'
export const IGS_EMAIL = "letsbuild@igsabrosoconstruction.com";
export const IGS_ADDRESS =
  "3rd Floor Keystone Bldg. B8 L3 Brgy. San Isidro Labrador 2, Dasmariñas City, Cavite";
export const IGS_MAPS_URL =
  "https://www.google.com/maps/place/KEYSTONE+B8+L3/@14.3437522,120.9328344,14z/data=!4m10!1m2!2m1!1sKeystone+Bldg.+B8+L3+Brgy.+San+Isidro+Labrador+2,+Dasmari%C3%B1as+City,+Cavite!3m6!1s0x3397d50c5f470643:0xf255428a58889e46!8m2!3d14.3410635!4d120.9501278!15sCkpLZXlzdG9uZSBCbGRnLiBCOCBMMyBCcmd5LiBTYW4gSXNpZHJvIExhYnJhZG9yIDIsIERhc21hcmnDsWFzIENpdHksIENhdml0ZZIBE2hpc3RvcmljYWxfbGFuZG1hcmvgAQA!16s%2Fg%2F11k3hnf7tj?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D";

// Open the floating IGS contact widget from anywhere.
export function openIgsContact() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("igs:open-contact"));
}
