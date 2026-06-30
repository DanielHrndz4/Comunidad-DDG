import Swal from "sweetalert2";

const appSwal = Swal.mixin({
  background: "#111827",
  color: "#f8fafc",
  confirmButtonColor: "#3ecf8e",
  cancelButtonColor: "#475569",
  buttonsStyling: false,
  customClass: {
    popup: "rounded-[24px] border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.4)]",
    confirmButton: "rounded-full bg-[#3ecf8e] px-4 py-2 text-sm font-semibold text-[#050505]",
    cancelButton: "rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white",
  },
});

export default appSwal;
