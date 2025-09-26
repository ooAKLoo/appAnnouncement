import React from "react";

/**
 * 手机模型的Mesh渲染组件
 * 从原始GLTF模型中提取的所有mesh定义
 * 
 * @param {Object} nodes - GLTF模型的节点
 * @param {Object} materials - GLTF模型的材质
 * @param {THREE.Material} imageMaterial - 屏幕的自定义材质
 */
function PhoneModelMesh({ nodes, materials, imageMaterial }) {
  return (
    <>
      {/* 第一个主要组 - 手机主体结构 */}
      <group name="bMosPntExNwiJNs" userData={{ name: "bMosPntExNwiJNs" }}>
        <mesh
          name="ttmRoLdJipiIOmf"
          castShadow
          receiveShadow
          geometry={nodes.ttmRoLdJipiIOmf?.geometry}
          material={materials.hUlRcbieVuIiOXG}
          userData={{ name: "ttmRoLdJipiIOmf" }}
        />
        <group name="HcyBnTbtxefaLfx" userData={{ name: "HcyBnTbtxefaLfx" }}>
          <mesh
            name="DjsDkGiopeiEJZK"
            castShadow
            receiveShadow
            geometry={nodes.DjsDkGiopeiEJZK?.geometry}
            material={materials.iCxrnlRvbVOguYp}
            userData={{ name: "DjsDkGiopeiEJZK" }}
          />
          <mesh
            name="zraMDXCGczVnffU"
            castShadow
            receiveShadow
            geometry={nodes.zraMDXCGczVnffU?.geometry}
            material={materials.hUlRcbieVuIiOXG}
            userData={{ name: "zraMDXCGczVnffU" }}
          />
          <mesh
            name="buRWvyqhBBgcJFo"
            castShadow
            receiveShadow
            geometry={nodes.buRWvyqhBBgcJFo?.geometry}
            material={materials.eHgELfGhsUorIYR}
            userData={{ name: "buRWvyqhBBgcJFo" }}
          />
          <mesh
            name="MrMmlCAsAxJpYqQ_0"
            castShadow
            receiveShadow
            geometry={nodes.MrMmlCAsAxJpYqQ_0?.geometry}
            material={materials.dxCVrUCvYhjVxqy}
            userData={{ name: "MrMmlCAsAxJpYqQ_0" }}
          />
          <mesh
            name="KVYuugCtKRpLNRG_0"
            castShadow
            receiveShadow
            geometry={nodes.KVYuugCtKRpLNRG_0?.geometry}
            material={materials.mvjnAONQuIshyfX}
            userData={{ name: "KVYuugCtKRpLNRG_0" }}
          />
          <mesh
            name="wqbHSzWaUxBCwxY_0"
            castShadow
            receiveShadow
            geometry={nodes.wqbHSzWaUxBCwxY_0?.geometry}
            material={materials.MHFGNLrDQbTNima}
            userData={{ name: "wqbHSzWaUxBCwxY_0" }}
          />
          <group name="yOlFnklNiZttLOW" userData={{ name: "yOlFnklNiZttLOW" }}>
            <mesh
              name="QvGDcbDApaGssma"
              castShadow
              receiveShadow
              geometry={nodes.QvGDcbDApaGssma?.geometry}
              material={materials.kUhjpatHUvkBwfM}
              userData={{ name: "QvGDcbDApaGssma" }}
            />
            <mesh
              name="MGPAkjCLsByKXcN"
              castShadow
              receiveShadow
              geometry={nodes.MGPAkjCLsByKXcN?.geometry}
              material={materials.kUhjpatHUvkBwfM}
              userData={{ name: "MGPAkjCLsByKXcN" }}
            />
            <mesh
              name="vFwJFNASGvEHWhs"
              castShadow
              receiveShadow
              geometry={nodes.vFwJFNASGvEHWhs?.geometry}
              material={materials.RJoymvEsaIItifI}
              userData={{ name: "vFwJFNASGvEHWhs" }}
            />
            <mesh
              name="fjHkOQLEMoyeYKr"
              castShadow
              receiveShadow
              geometry={nodes.fjHkOQLEMoyeYKr?.geometry}
              material={materials.AhrzSsKcKjghXhP}
              userData={{ name: "fjHkOQLEMoyeYKr" }}
            />
            <mesh
              name="RvfXLdAOBoQdZkP"
              castShadow
              receiveShadow
              geometry={nodes.RvfXLdAOBoQdZkP?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "RvfXLdAOBoQdZkP" }}
            />
            <mesh
              name="VTXyqxbrBeQSTEt"
              castShadow
              receiveShadow
              geometry={nodes.VTXyqxbrBeQSTEt?.geometry}
              material={materials.eHgELfGhsUorIYR}
              userData={{ name: "VTXyqxbrBeQSTEt" }}
            />
            <mesh
              name="evAxFwhaQUwXuua"
              castShadow
              receiveShadow
              geometry={nodes.evAxFwhaQUwXuua?.geometry}
              material={materials.KSIxMqttXxxmOYl}
              userData={{ name: "evAxFwhaQUwXuua" }}
            />
            <mesh
              name="USxQiqZgxHbRvqB"
              castShadow
              receiveShadow
              geometry={nodes.USxQiqZgxHbRvqB?.geometry}
              material={materials.mcPrzcBUcdqUybC}
              userData={{ name: "USxQiqZgxHbRvqB" }}
            />
          </group>
          <group name="UoRZOKZDdwJJsVl" userData={{ name: "UoRZOKZDdwJJsVl" }}>
            <mesh
              name="TvgBVmqNmSrFVfW"
              castShadow
              receiveShadow
              geometry={nodes.TvgBVmqNmSrFVfW?.geometry}
              material={materials.pIhYLPqiSQOZTjn}
              userData={{ name: "TvgBVmqNmSrFVfW" }}
            />
          </group>
          <group name="ZoJjqNAakQjcNhW" userData={{ name: "ZoJjqNAakQjcNhW" }}>
            <mesh
              name="xJhdvBbfHMKCBPl"
              castShadow
              receiveShadow
              geometry={nodes.xJhdvBbfHMKCBPl?.geometry}
              material={materials.dxCVrUCvYhjVxqy}
              userData={{ name: "xJhdvBbfHMKCBPl" }}
            />
            <mesh
              name="eYSJBzbqIfsHPsw"
              castShadow
              receiveShadow
              geometry={nodes.eYSJBzbqIfsHPsw?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "eYSJBzbqIfsHPsw" }}
            />
            <mesh
              name="KbMHiTYyrBmkZwz"
              castShadow
              receiveShadow
              geometry={nodes.KbMHiTYyrBmkZwz?.geometry}
              material={materials.dxCVrUCvYhjVxqy}
              userData={{ name: "KbMHiTYyrBmkZwz" }}
            />
            <mesh
              name="sVqcZvpZKhwSmoN"
              castShadow
              receiveShadow
              geometry={nodes.sVqcZvpZKhwSmoN?.geometry}
              material={materials.dxCVrUCvYhjVxqy}
              userData={{ name: "sVqcZvpZKhwSmoN" }}
            />
            <mesh
              name="GuYJryuYunhpphO"
              castShadow
              receiveShadow
              geometry={nodes.GuYJryuYunhpphO?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "GuYJryuYunhpphO" }}
            />
            <mesh
              name="DOjZomXdJsbbvcr"
              castShadow
              receiveShadow
              geometry={nodes.DOjZomXdJsbbvcr?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "DOjZomXdJsbbvcr" }}
            />
            <mesh
              name="cnreaSmJRdAuFia"
              castShadow
              receiveShadow
              geometry={nodes.cnreaSmJRdAuFia?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "cnreaSmJRdAuFia" }}
            />
            <group name="ZUpoBLZWQSTiNbu" userData={{ name: "ZUpoBLZWQSTiNbu" }}>
              <mesh
                name="HKHhmqmAZAOaaKY"
                castShadow
                receiveShadow
                geometry={nodes.HKHhmqmAZAOaaKY?.geometry}
                material={materials.dxCVrUCvYhjVxqy}
                userData={{ name: "HKHhmqmAZAOaaKY" }}
              />
              <mesh
                name="IZQgEjTfhbNtjHR"
                castShadow
                receiveShadow
                geometry={nodes.IZQgEjTfhbNtjHR?.geometry}
                material={materials.eShKpuMNVJTRrgg}
                userData={{ name: "IZQgEjTfhbNtjHR" }}
              />
            </group>
          </group>
          <group name="gxFsxFJsSGiHLmU" userData={{ name: "gxFsxFJsSGiHLmU" }}>
            <mesh
              name="pvdHknDTGDzVpwc"
              castShadow
              receiveShadow
              geometry={nodes.pvdHknDTGDzVpwc?.geometry}
              material={materials.xdyiJLYTYRfJffH}
              userData={{ name: "pvdHknDTGDzVpwc" }}
            />
            <mesh
              name="CfghdUoyzvwzIum"
              castShadow
              receiveShadow
              geometry={nodes.CfghdUoyzvwzIum?.geometry}
              material={materials.jpGaQNgTtEGkTfo}
              userData={{ name: "CfghdUoyzvwzIum" }}
            />
            <mesh
              name="MHfUXxLdYldKhVJ_0"
              castShadow
              receiveShadow
              geometry={nodes.MHfUXxLdYldKhVJ_0?.geometry}
              material={materials.dxCVrUCvYhjVxqy}
              userData={{ name: "MHfUXxLdYldKhVJ_0" }}
            />
            <mesh
              name="TxLQyfBdakwBPHu_0"
              castShadow
              receiveShadow
              geometry={nodes.TxLQyfBdakwBPHu_0?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "TxLQyfBdakwBPHu_0" }}
            />
          </group>
        </group>
      </group>

      {/* 第二个主要组 - 屏幕和前置部件 */}
      <group name="mfFUMfbDmZhhOWo" userData={{ name: "mfFUMfbDmZhhOWo" }}>
        <mesh
          name="DjdhycfQYjKMDyn"
          castShadow
          receiveShadow
          geometry={nodes.DjdhycfQYjKMDyn?.geometry}
          material={materials.ujsvqBWRMnqdwPx}
          userData={{ name: "DjdhycfQYjKMDyn" }}
        />
        <mesh
          name="usFLmqcyrnltBUr"
          castShadow
          receiveShadow
          geometry={nodes.usFLmqcyrnltBUr?.geometry}
          material={materials.sxNzrmuTqVeaXdg}
          userData={{ name: "usFLmqcyrnltBUr" }}
        />
        <group name="HzsqHeSJsfveFUX" userData={{ name: "HzsqHeSJsfveFUX" }}>
          {/* 屏幕mesh - 使用自定义材质 */}
          <mesh
            name="xXDHkMplTIDAXLN"
            castShadow
            receiveShadow={false}
            geometry={nodes.xXDHkMplTIDAXLN?.geometry}
            material={imageMaterial}
            userData={{ name: "xXDHkMplTIDAXLN" }}
          />
          <mesh
            name="IZbjANwSMLfgcvD"
            castShadow
            receiveShadow
            geometry={nodes.IZbjANwSMLfgcvD?.geometry}
            material={materials.hUlRcbieVuIiOXG}
            userData={{ name: "IZbjANwSMLfgcvD" }}
          />
          <mesh
            name="SysBlPspVQNIcce"
            castShadow
            receiveShadow
            geometry={nodes.SysBlPspVQNIcce?.geometry}
            material={materials.ujsvqBWRMnqdwPx}
            userData={{ name: "SysBlPspVQNIcce" }}
          />
          <mesh
            name="vELORlCJixqPHsZ"
            castShadow
            receiveShadow
            geometry={nodes.vELORlCJixqPHsZ?.geometry}
            material={materials.zFdeDaGNRwzccye}
            userData={{ name: "vELORlCJixqPHsZ" }}
          />
        </group>
        <group name="tqKcchoqxZAjtuJ" userData={{ name: "tqKcchoqxZAjtuJ" }}>
          <mesh
            name="IMPDFDiRXhPIUMV"
            castShadow
            receiveShadow
            geometry={nodes.IMPDFDiRXhPIUMV?.geometry}
            material={materials.hUlRcbieVuIiOXG}
            userData={{ name: "IMPDFDiRXhPIUMV" }}
          />
          <mesh
            name="EbQGKrWAqhBHiMv"
            castShadow
            receiveShadow
            geometry={nodes.EbQGKrWAqhBHiMv?.geometry}
            material={materials.TBLSREBUyLMVtJa}
            userData={{ name: "EbQGKrWAqhBHiMv" }}
          />
          <mesh
            name="EddVrWkqZTlvmci"
            castShadow
            receiveShadow
            geometry={nodes.EddVrWkqZTlvmci?.geometry}
            material={materials.xNrofRCqOXXHVZt}
            userData={{ name: "EddVrWkqZTlvmci" }}
          />
          <mesh
            name="aGrbyjnzqoVJenz"
            castShadow
            receiveShadow
            geometry={nodes.aGrbyjnzqoVJenz?.geometry}
            material={materials.xNrofRCqOXXHVZt}
            userData={{ name: "aGrbyjnzqoVJenz" }}
          />
          <mesh
            name="KSWlaxBcnPDpFCs"
            castShadow
            receiveShadow
            geometry={nodes.KSWlaxBcnPDpFCs?.geometry}
            material={materials.yQQySPTfbEJufve}
            userData={{ name: "KSWlaxBcnPDpFCs" }}
          />
        </group>
        <group name="jDbFLXkDWIFxkkS" userData={{ name: "jDbFLXkDWIFxkkS" }}>
          <mesh
            name="AQkWXGdRSkSZMav"
            castShadow
            receiveShadow
            geometry={nodes.AQkWXGdRSkSZMav?.geometry}
            material={materials.ujsvqBWRMnqdwPx}
            userData={{ name: "AQkWXGdRSkSZMav" }}
          />
        </group>
      </group>

      {/* 第三个主要组 - 相机和其他硬件部件 */}
      <group name="AeiRnzwRtMFJBlp" userData={{ name: "AeiRnzwRtMFJBlp" }}>
        <group name="lFhazxDamUcxZIL" userData={{ name: "lFhazxDamUcxZIL" }}>
          <mesh
            name="TakBsdEjEytCAMK"
            castShadow
            receiveShadow
            geometry={nodes.TakBsdEjEytCAMK?.geometry}
            material={materials.ZQfGMLaFcpPaLMU}
            userData={{ name: "TakBsdEjEytCAMK" }}
          />
          <mesh
            name="IykfmVvLplTsTEW"
            castShadow
            receiveShadow
            geometry={nodes.IykfmVvLplTsTEW?.geometry}
            material={materials.dwrMminMXjXXeek}
            userData={{ name: "IykfmVvLplTsTEW" }}
          />
        </group>
        <group name="PzwwYtxiYzbngZl" userData={{ name: "PzwwYtxiYzbngZl" }}>
          <mesh
            name="wLfSXtbwRlBrwof"
            castShadow
            receiveShadow
            geometry={nodes.wLfSXtbwRlBrwof?.geometry}
            material={materials.oZRkkORNzkufnGD}
            userData={{ name: "wLfSXtbwRlBrwof" }}
          />
          <mesh
            name="WJwwVjsahIXbJpU"
            castShadow
            receiveShadow
            geometry={nodes.WJwwVjsahIXbJpU?.geometry}
            material={materials.yhcAXNGcJWCqtIS}
            userData={{ name: "WJwwVjsahIXbJpU" }}
          />
          <mesh
            name="cibcwsZWGgGfpme"
            castShadow
            receiveShadow
            geometry={nodes.cibcwsZWGgGfpme?.geometry}
            material={materials.ZQfGMLaFcpPaLMU}
            userData={{ name: "cibcwsZWGgGfpme" }}
          />
          <mesh
            name="YfrJNXgMvGOAfzz"
            castShadow
            receiveShadow
            geometry={nodes.YfrJNXgMvGOAfzz?.geometry}
            material={materials.bCgzXjHOanGdTFV}
            userData={{ name: "YfrJNXgMvGOAfzz" }}
          />
          <mesh
            name="DCLCbjzqejuvsqH"
            castShadow
            receiveShadow
            geometry={nodes.DCLCbjzqejuvsqH?.geometry}
            material={materials.vhaEJjZoqGtyLdo}
            userData={{ name: "DCLCbjzqejuvsqH" }}
          />
          <mesh
            name="dkQXkqysxzfHFiP"
            castShadow
            receiveShadow
            geometry={nodes.dkQXkqysxzfHFiP?.geometry}
            material={materials.hUlRcbieVuIiOXG}
            userData={{ name: "dkQXkqysxzfHFiP" }}
          />
          <mesh
            name="FscwyiLIVNWUuKe"
            castShadow
            receiveShadow
            geometry={nodes.FscwyiLIVNWUuKe?.geometry}
            material={materials.fkUApOHLQsMUdfd}
            userData={{ name: "FscwyiLIVNWUuKe" }}
          />
        </group>
        <group name="DkixFPrDptubOHd" userData={{ name: "DkixFPrDptubOHd" }}>
          <group name="UWqABIyaOofdVYc" userData={{ name: "UWqABIyaOofdVYc" }}>
            <mesh
              name="CdalkzDVnwgdEhS"
              castShadow
              receiveShadow
              geometry={nodes.CdalkzDVnwgdEhS?.geometry}
              material={materials.jlzuBkUzuJqgiAK}
              userData={{ name: "CdalkzDVnwgdEhS" }}
            />
            <mesh
              name="NtjcIgolNGgYlCg"
              castShadow
              receiveShadow
              geometry={nodes.NtjcIgolNGgYlCg?.geometry}
              material={materials.PpwUTnTFZJXxCoE}
              userData={{ name: "NtjcIgolNGgYlCg" }}
            />
            <mesh
              name="zOPceDOPdLNSscX"
              castShadow
              receiveShadow
              geometry={nodes.zOPceDOPdLNSscX?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "zOPceDOPdLNSscX" }}
            />
            <mesh
              name="bxjlJpbNESedyat"
              castShadow
              receiveShadow
              geometry={nodes.bxjlJpbNESedyat?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "bxjlJpbNESedyat" }}
            />
            <mesh
              name="ehFpgEdYijLjwka"
              castShadow
              receiveShadow
              geometry={nodes.ehFpgEdYijLjwka?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "ehFpgEdYijLjwka" }}
            />
            <mesh
              name="IXWuqsIeTqBFLIy"
              castShadow
              receiveShadow
              geometry={nodes.IXWuqsIeTqBFLIy?.geometry}
              material={materials.EuTsEfyoAnyJIih}
              userData={{ name: "IXWuqsIeTqBFLIy" }}
            />
            <mesh
              name="qlwPlhojsxIgqwa"
              castShadow
              receiveShadow
              geometry={nodes.qlwPlhojsxIgqwa?.geometry}
              material={materials.EszxgwYUTxbhBrC}
              userData={{ name: "qlwPlhojsxIgqwa" }}
            />
            <mesh
              name="bpqFtgUKAOOPYpk"
              castShadow
              receiveShadow
              geometry={nodes.bpqFtgUKAOOPYpk?.geometry}
              material={materials.yQQySPTfbEJufve}
              userData={{ name: "bpqFtgUKAOOPYpk" }}
            />
            <mesh
              name="dxVZiHfQBLkPYHO"
              castShadow
              receiveShadow
              geometry={nodes.dxVZiHfQBLkPYHO?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "dxVZiHfQBLkPYHO" }}
            />
            <mesh
              name="guvLdFXlBjMoNra"
              castShadow
              receiveShadow
              geometry={nodes.guvLdFXlBjMoNra?.geometry}
              material={materials.fkUApOHLQsMUdfd}
              userData={{ name: "guvLdFXlBjMoNra" }}
            />
          </group>
          <group name="opnyVnejEsnQETV" userData={{ name: "opnyVnejEsnQETV" }}>
            <mesh
              name="PRPzbUhYhabBDYt"
              castShadow
              receiveShadow
              geometry={nodes.PRPzbUhYhabBDYt?.geometry}
              material={materials.jlzuBkUzuJqgiAK}
              userData={{ name: "PRPzbUhYhabBDYt" }}
            />
            <mesh
              name="oOTDgAlTGbFYzBo"
              castShadow
              receiveShadow
              geometry={nodes.oOTDgAlTGbFYzBo?.geometry}
              material={materials.PpwUTnTFZJXxCoE}
              userData={{ name: "oOTDgAlTGbFYzBo" }}
            />
            <mesh
              name="hGKQDeRmDnGNdjb"
              castShadow
              receiveShadow
              geometry={nodes.hGKQDeRmDnGNdjb?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "hGKQDeRmDnGNdjb" }}
            />
            <mesh
              name="XRoKUoMkItkzNYL"
              castShadow
              receiveShadow
              geometry={nodes.XRoKUoMkItkzNYL?.geometry}
              material={materials.jlzuBkUzuJqgiAK}
              userData={{ name: "XRoKUoMkItkzNYL" }}
            />
            <mesh
              name="FjtgRCsnzEoHpCy"
              castShadow
              receiveShadow
              geometry={nodes.FjtgRCsnzEoHpCy?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "FjtgRCsnzEoHpCy" }}
            />
            <mesh
              name="gJeeYWdxrKsnsVD"
              castShadow
              receiveShadow
              geometry={nodes.gJeeYWdxrKsnsVD?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "gJeeYWdxrKsnsVD" }}
            />
            <mesh
              name="KOgQmlOdVEyKocf"
              castShadow
              receiveShadow
              geometry={nodes.KOgQmlOdVEyKocf?.geometry}
              material={materials.jlzuBkUzuJqgiAK}
              userData={{ name: "KOgQmlOdVEyKocf" }}
            />
            <mesh
              name="gTmqYtKthFeRVJL"
              castShadow
              receiveShadow
              geometry={nodes.gTmqYtKthFeRVJL?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "gTmqYtKthFeRVJL" }}
            />
            <mesh
              name="obVkazjvaXyXFtA"
              castShadow
              receiveShadow
              geometry={nodes.obVkazjvaXyXFtA?.geometry}
              material={materials.EuTsEfyoAnyJIih}
              userData={{ name: "obVkazjvaXyXFtA" }}
            />
            <mesh
              name="zFlMfSCaOdRDBFx"
              castShadow
              receiveShadow
              geometry={nodes.zFlMfSCaOdRDBFx?.geometry}
              material={materials.EszxgwYUTxbhBrC}
              userData={{ name: "zFlMfSCaOdRDBFx" }}
            />
            <mesh
              name="ooeiSEXgcJckXsp"
              castShadow
              receiveShadow
              geometry={nodes.ooeiSEXgcJckXsp?.geometry}
              material={materials.yQQySPTfbEJufve}
              userData={{ name: "ooeiSEXgcJckXsp" }}
            />
            <mesh
              name="lfXEACUihtLFGfq"
              castShadow
              receiveShadow
              geometry={nodes.lfXEACUihtLFGfq?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "lfXEACUihtLFGfq" }}
            />
            <mesh
              name="eWbcqPskBBXuZDe"
              castShadow
              receiveShadow
              geometry={nodes.eWbcqPskBBXuZDe?.geometry}
              material={materials.fkUApOHLQsMUdfd}
              userData={{ name: "eWbcqPskBBXuZDe" }}
            />
          </group>
          <group name="GekGWBPcEuQbIrR" userData={{ name: "GekGWBPcEuQbIrR" }}>
            <mesh
              name="AdjkxvMXIDEHBMM"
              castShadow
              receiveShadow
              geometry={nodes.AdjkxvMXIDEHBMM?.geometry}
              material={materials.eShKpuMNVJTRrgg}
              userData={{ name: "AdjkxvMXIDEHBMM" }}
            />
            <mesh
              name="drpRvcOgsocXGbn"
              castShadow
              receiveShadow
              geometry={nodes.drpRvcOgsocXGbn?.geometry}
              material={materials.PpwUTnTFZJXxCoE}
              userData={{ name: "drpRvcOgsocXGbn" }}
            />
            <mesh
              name="KXVnYLSfTdVnSOf"
              castShadow
              receiveShadow
              geometry={nodes.KXVnYLSfTdVnSOf?.geometry}
              material={materials.jlzuBkUzuJqgiAK}
              userData={{ name: "KXVnYLSfTdVnSOf" }}
            />
            <mesh
              name="FFAjDZTPwYrUKAV"
              castShadow
              receiveShadow
              geometry={nodes.FFAjDZTPwYrUKAV?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "FFAjDZTPwYrUKAV" }}
            />
            <mesh
              name="AwsQCWysocWlYzN"
              castShadow
              receiveShadow
              geometry={nodes.AwsQCWysocWlYzN?.geometry}
              material={materials.xNrofRCqOXXHVZt}
              userData={{ name: "AwsQCWysocWlYzN" }}
            />
            <mesh
              name="wJqHahKxdxecSAC"
              castShadow
              receiveShadow
              geometry={nodes.wJqHahKxdxecSAC?.geometry}
              material={materials.EuTsEfyoAnyJIih}
              userData={{ name: "wJqHahKxdxecSAC" }}
            />
            <mesh
              name="SRYqzKwamLGuEGm"
              castShadow
              receiveShadow
              geometry={nodes.SRYqzKwamLGuEGm?.geometry}
              material={materials.EszxgwYUTxbhBrC}
              userData={{ name: "SRYqzKwamLGuEGm" }}
            />
            <mesh
              name="yxqQUnbopbiRvZr"
              castShadow
              receiveShadow
              geometry={nodes.yxqQUnbopbiRvZr?.geometry}
              material={materials.yQQySPTfbEJufve}
              userData={{ name: "yxqQUnbopbiRvZr" }}
            />
            <mesh
              name="xtMgDHhPqFLAHyB"
              castShadow
              receiveShadow
              geometry={nodes.xtMgDHhPqFLAHyB?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "xtMgDHhPqFLAHyB" }}
            />
            <mesh
              name="nnqwwoLVdMJlHIF"
              castShadow
              receiveShadow
              geometry={nodes.nnqwwoLVdMJlHIF?.geometry}
              material={materials.fkUApOHLQsMUdfd}
              userData={{ name: "nnqwwoLVdMJlHIF" }}
            />
          </group>
          <group name="rMbqHxTbHeRAIuc" userData={{ name: "rMbqHxTbHeRAIuc" }}>
            <mesh
              name="pXBNoLiaMwsDHRF"
              castShadow
              receiveShadow
              geometry={nodes.pXBNoLiaMwsDHRF?.geometry}
              material={materials.yiDkEwDSyEhavuP}
              userData={{ name: "pXBNoLiaMwsDHRF" }}
            />
            <mesh
              name="SCoTCDlNLPQMMyt"
              castShadow
              receiveShadow
              geometry={nodes.SCoTCDlNLPQMMyt?.geometry}
              material={materials.yiDkEwDSyEhavuP}
              userData={{ name: "SCoTCDlNLPQMMyt" }}
            />
            <mesh
              name="fdZyCEcqJDKBWVW"
              castShadow
              receiveShadow
              geometry={nodes.fdZyCEcqJDKBWVW?.geometry}
              material={materials.hUlRcbieVuIiOXG}
              userData={{ name: "fdZyCEcqJDKBWVW" }}
            />
          </group>
          <group name="iVIwUpzUeaqgBWi" userData={{ name: "iVIwUpzUeaqgBWi" }}>
            <mesh
              name="IkoiNqATMVoZFKD"
              castShadow
              receiveShadow
              geometry={nodes.IkoiNqATMVoZFKD?.geometry}
              material={materials.hiVunnLeAHkwGEo}
              userData={{ name: "IkoiNqATMVoZFKD" }}
            />
            <mesh
              name="rqgRAGHOwnuBypi"
              castShadow
              receiveShadow
              geometry={nodes.rqgRAGHOwnuBypi?.geometry}
              material={materials.HGhEhpqSBZRnjHC}
              userData={{ name: "rqgRAGHOwnuBypi" }}
            />
            <mesh
              name="npMJxzurVJQlumk"
              castShadow
              receiveShadow
              geometry={nodes.npMJxzurVJQlumk?.geometry}
              material={materials.JJvGZqtXqnnFakR}
              userData={{ name: "npMJxzurVJQlumk" }}
            />
          </group>
        </group>
      </group>
    </>
  );
}

export default PhoneModelMesh;